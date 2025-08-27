import React, { useEffect, useState, useContext } from 'react';
import './Dashboard.css';
import { AuthContext } from '../context/AuthContext';

interface Activity {
    action: string;
    description: string;
    time: string;
    user: string;
}

interface DashboardProps {
    onCreateTaskClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateTaskClick }) => {
    const { token, role } = useContext(AuthContext);
    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
    const [stats, setStats] = useState([
        { title: 'Active Teams', value: '...', icon: '💼', color: '#4A90E2' },
        { title: 'Pending Tasks', value: '...', icon: '📝', color: '#F39C12' },
        { title: 'Completed Today', value: '...', icon: '✅', color: '#7ED321' },
        { title: 'Team Members', value: '...', icon: '👨‍👩‍👧‍👦', color: '#9B59B6' }
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const backendBaseUrl = "http://localhost:8085/api/v1";

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Fetch stats concurrently
                const statEndpoints = [
                    'teams/count',
                    'tasks/pending/count',
                    'tasks/completed-today/count',
                    'users/count'
                ];

                const [teamCount, pendingCount, completedTodayCount, usersCount] = await Promise.all(
                    statEndpoints.map(endpoint => 
                        fetch(`${backendBaseUrl}/${endpoint}`, { headers: { "Authorization": `Bearer ${token}` } })
                            .then(res => {
                                if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
                                return res.json();
                            })
                    )
                );

                setStats([
                    { ...stats[0], value: teamCount.toString() },
                    { ...stats[1], value: pendingCount.toString() },
                    { ...stats[2], value: completedTodayCount.toString() },
                    { ...stats[3], value: usersCount.toString() },
                ]);

                // Fetch recent activities
                const activitiesResponse = await fetch(`${backendBaseUrl}/tasks?limit=5`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!activitiesResponse.ok) throw new Error("Failed to fetch activities");
                const tasksData = await activitiesResponse.json();

                const activities: Activity[] = tasksData.map((task: any) => ({
                    action: "Task Updated",
                    description: task.title || "Untitled task",
                    time: new Date(task.updatedAt || task.createdAt).toLocaleString(),
                    user: task.assignedTo || "Unassigned"
                }));
                setRecentActivities(activities);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
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
                                <h3 className="stat-value">{loading ? '...' : stat.value}</h3>
                                <p className="stat-title">{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="activities-section">
                    <h2 className="subtitle">Recent Activities</h2>
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {!loading && recentActivities.length > 0 && (
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
                    )}
                    {!loading && recentActivities.length === 0 && <p className="text-gray-500">No recent activities found.</p>}
                </div>

                <div className="quick-actions">
                    <h2 className="subtitle">Quick Actions</h2>
                    <div className="actions-grid">
                        <button className="action-btn" onClick={onCreateTaskClick}>
                            <span className="action-icon">➕</span>Create Task
                        </button>
                        {(role === 'ADMIN' || role === 'TEAM_LEAD') && (
                            <button className="action-btn"><span className="action-icon">👥</span>Add Team Member</button>
                        )}
                        <button className="action-btn"><span className="action-icon">📅</span>Schedule Meeting</button>
                        <button className="action-btn"><span className="action-icon">📊</span>View Reports</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;