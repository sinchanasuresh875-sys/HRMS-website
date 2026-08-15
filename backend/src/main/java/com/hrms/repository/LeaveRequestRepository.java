package com.hrms.repository;

import com.hrms.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    @Query("SELECT l FROM LeaveRequest l WHERE l.employee.manager.id = :managerId ORDER BY l.createdAt DESC")
    List<LeaveRequest> findTeamLeaveRequestsByManager(@Param("managerId") Long managerId);

    @Query("SELECT l FROM LeaveRequest l WHERE l.employee.manager.id = :managerId AND l.status = 'PENDING' ORDER BY l.createdAt DESC")
    List<LeaveRequest> findPendingTeamLeaveRequestsByManager(@Param("managerId") Long managerId);
}
