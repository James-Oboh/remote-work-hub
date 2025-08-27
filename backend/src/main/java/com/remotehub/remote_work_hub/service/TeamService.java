package com.remotehub.remote_work_hub.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.remotehub.remote_work_hub.entity.Team;
import com.remotehub.remote_work_hub.entity.User;
import com.remotehub.remote_work_hub.repository.TeamRepository;
import com.remotehub.remote_work_hub.repository.UserRepository;

@Service
public class TeamService {
    
    @Autowired
    private TeamRepository teamRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Team createTeam(Team team) {
        if (team.getName() == null || team.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be empty");
        }
        
        if (teamRepository.existsByName(team.getName())) {
            throw new RuntimeException("Team with this name already exists");
        }
        
        return teamRepository.save(team);
    }
    
    public Team addMember(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (team.getMembers().contains(user)) {
            throw new RuntimeException("User is already a member of this team");
        }
        
        team.getMembers().add(user);
        return teamRepository.save(team);
    }
    
    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }
    
    public Team getTeamById(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }
    
    public List<Team> getTeamsByMember(Long userId) {
        return teamRepository.findByMemberId(userId);
    }
    
    // method for dashboard statistics
    public long countAllTeams() {
        return teamRepository.count();
    }
}