package com.remotehub.remote_work_hub.repository;

import com.remotehub.remote_work_hub.entity.Task;
import com.remotehub.remote_work_hub.entity.TaskStatus;
import com.remotehub.remote_work_hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    
    List<Task> findByTeamId(Long teamId);
    
    List<Task> findByAssignedTo(User assignedTo);
    
    List<Task> findByStatus(TaskStatus status);
    
    List<Task> findByTeamIdAndStatus(Long teamId, TaskStatus status);
    
    List<Task> findByDeadlineBefore(LocalDateTime deadline);
    
    // Automatically generates a query for non-completed tasks by team ID
    List<Task> findByTeamIdAndCompletedIsFalse(Long teamId);
    
    // Automatically generates a query for non-completed tasks by user ID
    List<Task> findByAssignedToIdAndCompletedIsFalse(Long userId);

    // method to count tasks by status
    long countByStatus(TaskStatus status);

    // method to count completed tasks after a specific date/time
    long countByStatusAndCompletionDateAfter(TaskStatus status, LocalDateTime completionDate);
}
