import React, { useState, useEffect, useContext } from 'react';
import api  from '../services/api'; 
import { AuthContext } from '../context/AuthContext';
import './AdminPanel.css'; 

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { role } = useContext(AuthContext); 

  useEffect(() => {
    if (role !== 'ADMIN') {
      setError('Access Denied: You do not have permission to view this page.');
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>('/admin/users'); // FIX: Added type <User[]> to the get method
        setUsers(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [role]);

  const handleDeleteUser = async (userId: number) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      alert('User deleted successfully!');
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-panel-container">
      <h1 className="panel-title">Admin Panel</h1>
      <h2 className="section-title">All Users</h2>
      {users.length > 0 ? (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <div className="user-info">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete User
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminPanel;