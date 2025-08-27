package com.remotehub.remote_work_hub.controller;

import com.remotehub.remote_work_hub.entity.Team;
import com.remotehub.remote_work_hub.entity.User;
import com.remotehub.remote_work_hub.service.TeamService;
import com.remotehub.remote_work_hub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List; 

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    
    @Autowired
    private UserService userService;

    @Autowired
    private TeamService teamService;

    // Only users with the 'ADMIN' role can access this endpoint
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public List<User> getAllUsers() {
         //Call the instance method on the injected userService object
        return userService.getAllUsers();
    }

    // Only 'ADMIN's can delete users
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        //  Call the instance method on the injected userService object
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // A team leader can add team members, but not delete users
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM_LEAD')")
    @PostMapping("/teams/{teamId}/members")
    public ResponseEntity<Team> addTeamMember(@PathVariable Long teamId, @RequestBody User user) {
        // Call the instance method on the injected teamService object
        //  Pass the user's ID (a Long) instead of the whole User object
        Team updatedTeam = teamService.addMember(teamId, user.getId());
        return ResponseEntity.ok(updatedTeam);
    }
}