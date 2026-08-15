package com.hrms.repository;

import com.hrms.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByEmployeeIdOrderByTimestampDesc(Long employeeId);

    @Query("SELECT a FROM ActivityLog a WHERE a.employee.manager.id = :managerId ORDER BY a.timestamp DESC")
    List<ActivityLog> findTeamActivityLogsByManager(@Param("managerId") Long managerId);
}
