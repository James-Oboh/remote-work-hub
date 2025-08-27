package com.remotehub.remote_work_hub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.remotehub.remote_work_hub.entity.Task;
import com.remotehub.remote_work_hub.entity.User;
import com.remotehub.remote_work_hub.service.TaskService;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;
    
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestParam Long teamId, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.createTask(teamId, task));
    }
    
    @PutMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<Task> assignTask(@PathVariable Long taskId, @PathVariable Long userId) {
        return ResponseEntity.ok(taskService.assignTask(taskId, userId));
    }
    
    @PutMapping("/{taskId}/complete")
    public ResponseEntity<Task> completeTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.markTaskAsDone(taskId));
    }
    
    @PutMapping("/{taskId}/certify")
    public ResponseEntity<Task> certifyTask(@PathVariable Long taskId, @AuthenticationPrincipal User certifier) {
        if (certifier == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(taskService.certifyTaskComplete(taskId, certifier));
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Task>> getTasksByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(taskService.getTasksByTeam(teamId));
    }
    
    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
        return ResponseEntity.ok(taskService.getTaskById(taskId));
    }
    
    @GetMapping("/active/team/{teamId}")
    public ResponseEntity<List<Task>> getActiveTasksByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(taskService.getActiveTasksByTeam(teamId));
    }
    
    @GetMapping("/active/user/{userId}")
    public ResponseEntity<List<Task>> getActiveTasksByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(taskService.getActiveTasksByUser(userId));
    }

    // New endpoint for pending tasks count
    @GetMapping("/pending/count")
    public ResponseEntity<Long> getPendingTaskCount() {
        return ResponseEntity.ok(taskService.countPendingTasks());
    }

    // New endpoint for tasks completed today
    @GetMapping("/completed-today/count")
    public ResponseEntity<Long> getCompletedTodayTaskCount() {
        return ResponseEntity.ok(taskService.countCompletedTasksToday());
    }
}
