package com.remotehub.remote_work_hub.repository;

import com.remotehub.remote_work_hub.entity.Task;
import com.remotehub.remote_work_hub.entity.TaskStatus;
import com.remotehub.remote_work_hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByTeamId(Long teamId);
    
    List<Task> findByAssignedTo(User assignedTo);
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByTeamIdAndStatus(Long teamId, TaskStatus status);
    
    List<Task> findByDeadlineBefore(LocalDateTime deadline);
    
    @Query("SELECT t FROM Task t WHERE t.team.id = :teamId AND t.completed = false")
    List<Task> findActiveTasksByTeam(@Param("teamId") Long teamId);
    
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId AND t.completed = false")
    List<Task> findActiveTasksByUser(@Param("userId") Long userId);
}
