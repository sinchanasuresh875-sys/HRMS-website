package com.hrms.repository;

import com.hrms.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToIdOrderByDueDateAsc(Long employeeId);

    @Query("SELECT t FROM Task t WHERE t.assignedTo.manager.id = :managerId OR t.assignedBy.id = :managerId ORDER BY t.createdAt DESC")
    List<Task> findTeamTasksByManager(@Param("managerId") Long managerId);
}
