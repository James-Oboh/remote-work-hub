package com.remotehub.remote_work_hub.repository;

import com.remotehub.remote_work_hub.entity.Team;
import com.remotehub.remote_work_hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    
    List<Team> findByManager(User manager);
    
    @Query("SELECT t FROM Team t JOIN t.members m WHERE m.id = :userId")
    List<Team> findByMemberId(@Param("userId") Long userId);
    
    List<Team> findByNameContainingIgnoreCase(String name);
    
    boolean existsByName(String name);
}
