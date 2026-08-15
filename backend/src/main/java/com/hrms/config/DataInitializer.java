package com.hrms.config;

import com.hrms.entity.*;
import com.hrms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (employeeRepository.count() > 0) {
            return;
        }

        // 1. Seed Organizations
        Organization org1 = new Organization();
        org1.setCode("ACME-TECH");
        org1.setName("Acme Global Technologies");
        org1.setType("Enterprise");
        org1.setIndustry("Information Technology");
        org1.setDescription("Leading enterprise cloud software provider.");
        org1.setEmail("contact@acmeglobal.com");
        org1.setPhone("+1 (555) 234-5678");
        org1.setCity("San Francisco");
        org1.setState("California");
        org1.setCountry("United States");
        org1.setEstablishedDate("2015-04-15");
        org1.setStatus("Active");
        org1 = organizationRepository.save(org1);

        Organization org2 = new Organization();
        org2.setCode("NEXUS-HLTH");
        org2.setName("Nexus Health Systems");
        org2.setType("Enterprise");
        org2.setIndustry("Healthcare");
        org2.setDescription("Digital healthcare network & medical diagnostics.");
        org2.setEmail("info@nexushealth.org");
        org2.setPhone("+44 20 7946 0912");
        org2.setCity("London");
        org2.setCountry("United Kingdom");
        org2.setEstablishedDate("2018-09-20");
        org2.setStatus("Active");
        org2 = organizationRepository.save(org2);

        // 2. Seed Super Admin
        Employee superAdmin = new Employee();
        superAdmin.setEmployeeId("SA-001");
        superAdmin.setFirstName("Alex");
        superAdmin.setLastName("Morgan");
        superAdmin.setEmail("admin@hrms.com");
        superAdmin.setPassword(passwordEncoder.encode("admin123"));
        superAdmin.setRole(Role.SUPER_ADMIN);
        superAdmin.setDepartment("Executive Board");
        superAdmin.setDesignation("Chief System Administrator");
        superAdmin.setEmploymentStatus("ACTIVE");
        superAdmin = employeeRepository.save(superAdmin);

        // 3. Seed Managers (Manager is an Employee entity)
        Employee manager1 = new Employee();
        manager1.setEmployeeId("MGR-101");
        manager1.setFirstName("Sarah");
        manager1.setLastName("Jenkins");
        manager1.setEmail("sarah.jenkins@acmeglobal.com");
        manager1.setPassword(passwordEncoder.encode("manager123"));
        manager1.setPhone("+1 (555) 301-4492");
        manager1.setRole(Role.MANAGER);
        manager1.setOrganization(org1);
        manager1.setDepartment("Engineering");
        manager1.setDesignation("Director of Software Engineering");
        manager1.setJoiningDate(LocalDate.of(2021, 3, 15));
        manager1.setEmploymentType("Full-Time");
        manager1.setEmploymentStatus("ACTIVE");
        manager1 = employeeRepository.save(manager1);

        Employee manager2 = new Employee();
        manager2.setEmployeeId("MGR-201");
        manager2.setFirstName("David");
        manager2.setLastName("Ross");
        manager2.setEmail("david.ross@nexushealth.org");
        manager2.setPassword(passwordEncoder.encode("manager123"));
        manager2.setPhone("+44 20 7946 0888");
        manager2.setRole(Role.MANAGER);
        manager2.setOrganization(org2);
        manager2.setDepartment("Clinical Ops");
        manager2.setDesignation("VP of Medical Operations");
        manager2.setJoiningDate(LocalDate.of(2022, 1, 10));
        manager2.setEmploymentType("Full-Time");
        manager2.setEmploymentStatus("ACTIVE");
        manager2 = employeeRepository.save(manager2);

        // 4. Seed Employees (reporting to Managers)
        Employee emp1 = new Employee();
        emp1.setEmployeeId("EMP-102");
        emp1.setFirstName("John");
        emp1.setLastName("Doe");
        emp1.setEmail("john.doe@acmeglobal.com");
        emp1.setPassword(passwordEncoder.encode("emp123"));
        emp1.setPhone("+1 (555) 819-2049");
        emp1.setRole(Role.EMPLOYEE);
        emp1.setOrganization(org1);
        emp1.setManager(manager1);
        emp1.setDepartment("Engineering");
        emp1.setDesignation("Senior Frontend Developer");
        emp1.setJoiningDate(LocalDate.of(2022, 6, 1));
        emp1.setEmploymentType("Full-Time");
        emp1.setEmploymentStatus("ACTIVE");
        emp1 = employeeRepository.save(emp1);

        Employee emp2 = new Employee();
        emp2.setEmployeeId("EMP-103");
        emp2.setFirstName("Emily");
        emp2.setLastName("Watson");
        emp2.setEmail("emily.watson@acmeglobal.com");
        emp2.setPassword(passwordEncoder.encode("emp123"));
        emp2.setPhone("+1 (555) 912-3847");
        emp2.setRole(Role.EMPLOYEE);
        emp2.setOrganization(org1);
        emp2.setManager(manager1);
        emp2.setDepartment("Engineering");
        emp2.setDesignation("Full Stack Engineer");
        emp2.setJoiningDate(LocalDate.of(2023, 2, 15));
        emp2.setEmploymentType("Full-Time");
        emp2.setEmploymentStatus("ACTIVE");
        emp2 = employeeRepository.save(emp2);

        Employee emp3 = new Employee();
        emp3.setEmployeeId("EMP-202");
        emp3.setFirstName("Michael");
        emp3.setLastName("Chang");
        emp3.setEmail("michael.chang@nexushealth.org");
        emp3.setPassword(passwordEncoder.encode("emp123"));
        emp3.setPhone("+44 20 7946 0555");
        emp3.setRole(Role.EMPLOYEE);
        emp3.setOrganization(org2);
        emp3.setManager(manager2);
        emp3.setDepartment("Clinical Ops");
        emp3.setDesignation("Health Data Specialist");
        emp3.setJoiningDate(LocalDate.of(2023, 5, 20));
        emp3.setEmploymentType("Full-Time");
        emp3.setEmploymentStatus("ACTIVE");
        emp3 = employeeRepository.save(emp3);

        // 5. Seed Attendance
        Attendance att1 = new Attendance();
        att1.setEmployee(emp1);
        att1.setDate(LocalDate.now());
        att1.setCheckIn(LocalTime.of(9, 0));
        att1.setCheckOut(LocalTime.of(17, 30));
        att1.setWorkingHours(8.5);
        att1.setStatus("PRESENT");
        attendanceRepository.save(att1);

        Attendance att2 = new Attendance();
        att2.setEmployee(emp2);
        att2.setDate(LocalDate.now());
        att2.setCheckIn(LocalTime.of(9, 15));
        att2.setWorkingHours(7.75);
        att2.setStatus("PRESENT");
        attendanceRepository.save(att2);

        // 6. Seed Leave Request
        LeaveRequest leave = new LeaveRequest();
        leave.setEmployee(emp1);
        leave.setLeaveType("Annual");
        leave.setStartDate(LocalDate.now().plusDays(5));
        leave.setEndDate(LocalDate.now().plusDays(7));
        leave.setTotalDays(3);
        leave.setReason("Annual family vacation");
        leave.setStatus("PENDING");
        leaveRequestRepository.save(leave);

        // 7. Seed Task
        Task task = new Task();
        task.setTitle("Implement JWT Refresh Tokens");
        task.setDescription("Add token renewal endpoint and automatic silent retry in frontend API interceptor.");
        task.setAssignedTo(emp1);
        task.setAssignedBy(manager1);
        task.setPriority("HIGH");
        task.setStatus("IN_PROGRESS");
        task.setStartDate(LocalDate.now().minusDays(2));
        task.setDueDate(LocalDate.now().plusDays(3));
        taskRepository.save(task);

        // 8. Seed Activity Log & Notification
        activityLogRepository.save(new ActivityLog(emp1, "Check In", "Attendance", "Checked in at 09:00 AM"));
        notificationRepository.save(new Notification(emp1, "New Task Assigned", "Manager Sarah Jenkins assigned you: Implement JWT Refresh Tokens", "info"));
    }
}
