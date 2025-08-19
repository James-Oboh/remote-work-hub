package com.remotehub.remote_work_hub.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.remotehub.remote_work_hub.entity.Task;
import com.remotehub.remote_work_hub.entity.Team;
import com.remotehub.remote_work_hub.entity.User;
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
    
    public Task markTaskComplete(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setCompleted(true);
        task.setStatus(com.remotehub.remote_work_hub.entity.TaskStatus.DONE);
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
        return taskRepository.findActiveTasksByTeam(teamId);
    }
    
    public List<Task> getActiveTasksByUser(Long userId) {
        return taskRepository.findActiveTasksByUser(userId);
    }
}