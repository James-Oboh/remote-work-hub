package com.remotehub.remote_work_hub.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.remotehub.remote_work_hub.entity.Task;
import com.remotehub.remote_work_hub.entity.Team;
import com.remotehub.remote_work_hub.entity.User;
import com.remotehub.remote_work_hub.entity.Role;
import com.remotehub.remote_work_hub.entity.TaskStatus;
import com.remotehub.remote_work_hub.repository.TaskRepository;
import com.remotehub.remote_work_hub.repository.TeamRepository;
import com.remotehub.remote_work_hub.repository.UserRepository;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private UserRepository userRepository;

    public Task createTask(Long teamId, Task task) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Task title cannot be empty");
        }
        task.setTeam(team);
        task.setStatus(TaskStatus.TODO);
        return taskRepository.save(task);
    }
    
    public Task assignTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        task.setAssignedTo(user);
        return taskRepository.save(task);
    }
    
    public Task markTaskAsDone(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(TaskStatus.DONE);
        
        task.setCompletionDate(LocalDateTime.now());
        return taskRepository.save(task);
    }
    
    public Task certifyTaskComplete(Long taskId, User certifier) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getStatus() == null || task.getStatus() != TaskStatus.DONE) {
            throw new RuntimeException("Task must be marked as 'DONE' before certification.");
        }

        if (certifier.getRole() != Role.ADMIN && certifier.getRole() != Role.TEAM_LEAD && certifier.getRole() != Role.MANAGER) {
            throw new SecurityException("User does not have permission to certify tasks");
        }
        
        task.setCertifiedBy(certifier);
        task.setStatus(TaskStatus.CERTIFIED);
        return taskRepository.save(task);
    }

    public List<Task> getTasksByTeam(Long teamId) {
        return taskRepository.findByTeamId(teamId);
    }
    
    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }
    
    public List<Task> getActiveTasksByTeam(Long teamId) {
        // Use the new, cleaner repository method
        return taskRepository.findByTeamIdAndCompletedIsFalse(teamId);
    }
    
    public List<Task> getActiveTasksByUser(Long userId) {
       
        return taskRepository.findByAssignedToIdAndCompletedIsFalse(userId);
    }

    
    public long countPendingTasks() {
        return taskRepository.countByStatus(TaskStatus.TODO);
    }
    
    public long countCompletedTasksToday() {
        // Calculate the start of the day
        LocalDateTime startOfToday = LocalDateTime.now().minusHours(24);
        return taskRepository.countByStatusAndCompletionDateAfter(TaskStatus.DONE, startOfToday);
    }
}
