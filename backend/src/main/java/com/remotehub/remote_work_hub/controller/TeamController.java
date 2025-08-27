package com.remotehub.remote_work_hub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.remotehub.remote_work_hub.entity.Team;
import com.remotehub.remote_work_hub.service.TeamService;

@RestController
@RequestMapping("/api/v1/teams")
public class TeamController {
    @Autowired
    private TeamService teamService;

    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return ResponseEntity.ok(teamService.createTeam(team));
    }

    @PostMapping("/{teamId}/add-member/{userId}")
    public ResponseEntity<Team> addMember(@PathVariable Long teamId, @PathVariable Long userId) {
        return ResponseEntity.ok(teamService.addMember(teamId, userId));
    }

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    // New endpoint for team count
    @GetMapping("/count")
    public ResponseEntity<Long> getTeamCount() {
        return ResponseEntity.ok(teamService.countAllTeams());
    }
}