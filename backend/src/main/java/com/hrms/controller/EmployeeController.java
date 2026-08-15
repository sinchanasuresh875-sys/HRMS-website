package com.hrms.controller;

import com.hrms.dto.CreateEmployeeRequest;
import com.hrms.dto.CreateManagerRequest;
import com.hrms.entity.Employee;
import com.hrms.entity.Organization;
import com.hrms.entity.Role;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.OrganizationRepository;
import com.hrms.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Get own profile (Employee + Manager + Super Admin)
    @GetMapping("/me")
    public ResponseEntity<Employee> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(principal.getEmployee());
    }

    // 2. Update own profile (permitted fields only)
    @PutMapping("/me")
    public ResponseEntity<Employee> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Employee updateData) {
        Employee current = employeeRepository.findById(principal.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (updateData.getPhone() != null) current.setPhone(updateData.getPhone());
        if (updateData.getAddress() != null) current.setAddress(updateData.getAddress());
        if (updateData.getProfilePhoto() != null) current.setProfilePhoto(updateData.getProfilePhoto());

        return ResponseEntity.ok(employeeRepository.save(current));
    }

    // 3. Manager views team employees
    @GetMapping("/team")
    @PreAuthorize("hasAnyRole('MANAGER', 'SUPER_ADMIN')")
    public ResponseEntity<List<Employee>> getTeamEmployees(@AuthenticationPrincipal UserPrincipal principal) {
        Employee manager = principal.getEmployee();
        if (manager.getRole() == Role.SUPER_ADMIN) {
            return ResponseEntity.ok(employeeRepository.findAll());
        }

        List<Employee> team = employeeRepository.findByManagerIdAndOrganizationId(
                manager.getId(), manager.getOrganization().getId()
        );
        return ResponseEntity.ok(team);
    }

    // 4. Manager adds employee (auto-assigns orgId = manager.orgId, managerId = currentManager.id, role = EMPLOYEE)
    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Employee> addEmployee(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateEmployeeRequest request) {

        Employee manager = principal.getEmployee();
        if (manager.getOrganization() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Manager does not belong to any organization.");
        }

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already registered.");
        }

        Employee newEmp = new Employee();
        newEmp.setEmployeeId(request.getEmployeeId() != null ? request.getEmployeeId() : "EMP-" + System.currentTimeMillis() % 10000);
        newEmp.setFirstName(request.getFirstName());
        newEmp.setLastName(request.getLastName());
        newEmp.setEmail(request.getEmail());
        newEmp.setPassword(passwordEncoder.encode("Welcome@123")); // Default initial password
        newEmp.setPhone(request.getPhone());
        newEmp.setGender(request.getGender());
        newEmp.setDateOfBirth(request.getDateOfBirth());
        newEmp.setProfilePhoto(request.getProfilePhoto());
        newEmp.setAddress(request.getAddress());
        newEmp.setDepartment(request.getDepartment());
        newEmp.setDesignation(request.getDesignation());
        newEmp.setJoiningDate(request.getJoiningDate());
        newEmp.setEmploymentType(request.getEmploymentType());

        // Automatic business rules:
        newEmp.setRole(Role.EMPLOYEE);
        newEmp.setOrganization(manager.getOrganization());
        newEmp.setManager(manager);
        newEmp.setEmploymentStatus("ACTIVE");

        return ResponseEntity.status(HttpStatus.CREATED).save(employeeRepository.save(newEmp));
    }

    // 5. Super Admin creates Manager
    @PostMapping("/managers")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Employee> createManager(@Valid @RequestBody CreateManagerRequest request) {
        Organization org = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Target organization not found."));

        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is already registered.");
        }

        Employee newManager = new Employee();
        newManager.setEmployeeId(request.getEmployeeId() != null ? request.getEmployeeId() : "MGR-" + System.currentTimeMillis() % 10000);
        newManager.setFirstName(request.getFirstName());
        newManager.setLastName(request.getLastName());
        newManager.setEmail(request.getEmail());
        newManager.setPassword(passwordEncoder.encode("Manager@123"));
        newManager.setPhone(request.getPhone());
        newManager.setGender(request.getGender());
        newManager.setDateOfBirth(request.getDateOfBirth());
        newManager.setProfilePhoto(request.getProfilePhoto());
        newManager.setAddress(request.getAddress());
        newManager.setDepartment(request.getDepartment());
        newManager.setDesignation(request.getDesignation());
        newManager.setJoiningDate(request.getJoiningDate());
        newManager.setEmploymentType(request.getEmploymentType());

        newManager.setRole(Role.MANAGER);
        newManager.setOrganization(org);
        newManager.setEmploymentStatus("ACTIVE");

        return ResponseEntity.status(HttpStatus.CREATED).save(employeeRepository.save(newManager));
    }

    // 6. View single employee (Strict team/org authorization check)
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {

        Employee requester = principal.getEmployee();
        Employee target = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee record not found."));

        validateAccessToEmployee(requester, target);

        return ResponseEntity.ok(target);
    }

    // 7. Edit employee (Strict authorization check)
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody Employee updateData) {

        Employee requester = principal.getEmployee();
        Employee target = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee record not found."));

        validateAccessToEmployee(requester, target);

        // Update allowed fields
        if (updateData.getFirstName() != null) target.setFirstName(updateData.getFirstName());
        if (updateData.getLastName() != null) target.setLastName(updateData.getLastName());
        if (updateData.getPhone() != null) target.setPhone(updateData.getPhone());
        if (updateData.getDepartment() != null) target.setDepartment(updateData.getDepartment());
        if (updateData.getDesignation() != null) target.setDesignation(updateData.getDesignation());
        if (updateData.getAddress() != null) target.setAddress(updateData.getAddress());

        return ResponseEntity.ok(employeeRepository.save(target));
    }

    // 8. Soft Delete / Deactivate employee (employmentStatus = INACTIVE)
    @PatchMapping("/{id}/status")
    public ResponseEntity<Employee> changeEmployeeStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestParam String status) {

        Employee requester = principal.getEmployee();
        Employee target = employeeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee record not found."));

        validateAccessToEmployee(requester, target);

        target.setEmploymentStatus(status.toUpperCase());
        return ResponseEntity.ok(employeeRepository.save(target));
    }

    // Helper for strict authorization boundary enforcement
    private void validateAccessToEmployee(Employee requester, Employee target) {
        if (requester.getRole() == Role.SUPER_ADMIN) {
            return; // Super admin has global access
        }

        if (requester.getId().equals(target.getId())) {
            return; // Own data access allowed
        }

        if (requester.getRole() == Role.MANAGER) {
            // Must belong to same organization AND be reporting to this manager
            boolean sameOrg = requester.getOrganization() != null &&
                    target.getOrganization() != null &&
                    requester.getOrganization().getId().equals(target.getOrganization().getId());

            boolean isMyTeam = target.getManager() != null &&
                    target.getManager().getId().equals(requester.getId());

            if (!sameOrg || !isMyTeam) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Employee does not belong to your team or organization.");
            }
            return;
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: Unauthorized access attempt.");
    }
}
