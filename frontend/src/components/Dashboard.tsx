import React, { useEffect, useState, useContext } from 'react';
import './Dashboard.css';
import { AuthContext } from '../context/AuthContext';

interface Activity {
  action: string;
  description: string;
  time: string;
  user: string;
}

const Dashboard: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const stats = [
    { title: 'Active Teams', value: '8', icon: '💼', color: '#4A90E2' },
    { title: 'Pending Tasks', value: '23', icon: '📝', color: '#F39C12' },
    { title: 'Completed Today', value: '15', icon: '✅', color: '#7ED321' },
    { title: 'Team Members', value: '42', icon: '👨‍👩‍👧‍👦', color: '#9B59B6' }
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8085/api/v1/tasks", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();

        const activities: Activity[] = data.map((task: any) => ({
          action: "Task",
          description: task.title || task.name || "Untitled task",
          time: task.createdAt || "just now",
          user: task.assignedTo || "Unassigned"
        }));

        setRecentActivities(activities);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTasks();
  }, [token]);

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="title text-center fade-in">Welcome to Your Remote Work Hub</h1>
        <p className="subtitle text-center" style={{ marginBottom: '40px' }}>
          Stay connected, organized, and productive with your remote team
        </p>

        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <span>{stat.icon}</span>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="activities-section">
          <h2 className="subtitle">Recent Activities</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="activities-list">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="activity-item fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="activity-icon">📊</div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-action">{activity.action}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                  <span className="activity-user">by {activity.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2 className="subtitle">Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn"><span className="action-icon">➕</span>Create Task</button>
            <button className="action-btn"><span className="action-icon">👥</span>Add Team Member</button>
            <button className="action-btn"><span className="action-icon">📅</span>Schedule Meeting</button>
            <button className="action-btn"><span className="action-icon">📊</span>View Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
