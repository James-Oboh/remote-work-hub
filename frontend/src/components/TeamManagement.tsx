import React, { useState } from 'react';
import './TeamManagement.css';

interface Team {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  manager: string;
  createdAt: string;
}

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: 'Design Team',
      description: 'Creative design and UX team',
      memberCount: 8,
      manager: 'Sarah Johnson',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Development Team',
      description: 'Software development and engineering',
      memberCount: 12,
      manager: 'Mike Wilson',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Marketing Team',
      description: 'Digital marketing and growth',
      memberCount: 6,
      manager: 'Lisa Park',
      createdAt: '2024-01-20'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    manager: ''
  });

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const team: Team = {
      id: teams.length + 1,
      name: newTeam.name,
      description: newTeam.description,
      memberCount: 1,
      manager: newTeam.manager,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setTeams([...teams, team]);
    setNewTeam({ name: '', description: '', manager: '' });
    setShowCreateForm(false);
  };

  const handleDeleteTeam = (id: number) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  return (
    <div className="team-management">
      <div className="container">
        <div className="page-header">
          <h1 className="title">Team Management</h1>
          <p className="subtitle">Manage your teams and team members</p>
        </div>

        <div className="actions-bar">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            <span className="btn-icon">➕</span>
            Create New Team
          </button>
        </div>

        {showCreateForm && (
          <div className="create-team-form card">
            <h3>Create New Team</h3>
            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label htmlFor="teamName" className="form-label">Team Name</label>
                <input
                  type="text"
                  id="teamName"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  className="form-input"
                  placeholder="Enter team name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teamDescription" className="form-label">Description</label>
                <textarea
                  id="teamDescription"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                  className="form-input"
                  placeholder="Enter team description"
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="teamManager" className="form-label">Team Manager</label>
                <input
                  type="text"
                  id="teamManager"
                  value={newTeam.manager}
                  onChange={(e) => setNewTeam({...newTeam, manager: e.target.value})}
                  className="form-input"
                  placeholder="Enter manager name"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create Team</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="teams-grid">
          {teams.map(team => (
            <div key={team.id} className="team-card card">
              <div className="team-header">
                <h3 className="team-name">{team.name}</h3>
                <div className="team-actions">
                  <button className="btn-icon">✏️</button>
                  <button 
                    className="btn-icon delete"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    ��️
                  </button>
                </div>
              </div>
              
              <p className="team-description">{team.description}</p>
              
              <div className="team-stats">
                <div className="stat">
                  <span className="stat-label">Members:</span>
                  <span className="stat-value">{team.memberCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Manager:</span>
                  <span className="stat-value">{team.manager}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Created:</span>
                  <span className="stat-value">{team.createdAt}</span>
                </div>
              </div>
              
              <div className="team-actions-bottom">
                <button className="btn btn-secondary">View Members</button>
                <button className="btn btn-primary">Add Member</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;