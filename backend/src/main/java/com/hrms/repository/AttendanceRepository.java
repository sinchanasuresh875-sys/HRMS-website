package com.hrms.repository;

import com.hrms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployeeIdOrderByDateDesc(Long employeeId);
    Optional<Attendance> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.employee.manager.id = :managerId AND a.date = :date")
    List<Attendance> findTeamAttendanceByManagerAndDate(@Param("managerId") Long managerId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.employee.manager.id = :managerId ORDER BY a.date DESC")
    List<Attendance> findTeamAttendanceByManager(@Param("managerId") Long managerId);
}
