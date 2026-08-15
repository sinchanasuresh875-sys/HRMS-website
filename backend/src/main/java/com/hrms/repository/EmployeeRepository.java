package com.hrms.repository;

import com.hrms.entity.Employee;
import com.hrms.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeId(String employeeId);

    List<Employee> findByOrganizationId(Long organizationId);
    List<Employee> findByManagerIdAndOrganizationId(Long managerId, Long organizationId);
    List<Employee> findByRole(Role role);
    List<Employee> findByOrganizationIdAndRole(Long organizationId, Role role);

    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
}
