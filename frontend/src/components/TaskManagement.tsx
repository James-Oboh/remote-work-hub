import React, { useState, useContext, useEffect, createContext, ReactNode } from 'react';
import { AuthContext } from '../context/AuthContext';
import './TaskManagement.css';

// Type Definitions 

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  team: string;
  deadline: string;
  completed: boolean;
  certifiedBy?: string;
}

// --- Task Management Component ---
// This component is the main application logic, updated to use local CSS classes.
const TaskManagement: React.FC = () => {
  // All hooks must be called at the top level of the component,
  // before any conditional returns.
  const { user, role, loading } = useContext(AuthContext);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Website Redesign Mockup',
      description: 'Create new design mockups for the homepage',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedTo: 'Sarah Johnson',
      team: 'Design Team',
      deadline: '2024-02-15',
      completed: false,
    },
    {
      id: 2,
      title: 'API Documentation Update',
      description: 'Update API documentation with new endpoints',
      status: 'TODO',
      priority: 'MEDIUM',
      assignedTo: 'David Kim',
      team: 'Development Team',
      deadline: '2024-02-20',
      completed: false,
    },
    {
      id: 3,
      title: 'Marketing Campaign Launch',
      description: 'Launch Q1 marketing campaign',
      status: 'DONE',
      priority: 'HIGH',
      assignedTo: 'Lisa Park',
      team: 'Marketing Team',
      deadline: '2024-02-10',
      completed: true,
      certifiedBy: 'Jane Doe',
    }
  ]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    assignedTo: '',
    team: '',
    deadline: '',
  });

  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  // Filter tasks based on the search query.
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to get color based on status.
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO': return 'status-badge--todo';
      case 'IN_PROGRESS': return 'status-badge--in-progress';
      case 'DONE': return 'status-badge--done';
      default: return 'status-badge--default';
    }
  };

  // Helper function to get color based on priority.
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH': return 'priority-badge--high';
      case 'MEDIUM': return 'priority-badge--medium';
      case 'LOW': return 'priority-badge--low';
      default: return 'priority-badge--default';
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      status: 'TODO' as TaskStatus,
      priority: newTask.priority as TaskPriority,
      assignedTo: newTask.assignedTo,
      team: newTask.team,
      deadline: newTask.deadline,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'MEDIUM',
      assignedTo: '',
      team: '',
      deadline: '',
    });
    setShowCreateForm(false);
  };

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ?
      { ...task,
        status: newStatus,
        completed: newStatus === 'DONE',
        certifiedBy: newStatus === 'DONE' ? task.certifiedBy : undefined
      } :
      task
    ));
  };

  const handleCertifyTask = (taskId: number) => {
    if (role !== 'TeamLead' || !user) {
      console.log("Not authorized to certify tasks.");
      return;
    }
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, certifiedBy: user.username } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="task-management">
      <div className="container">
        <div className="page-header">
          <h1 className="title">Task Management</h1>
          <p className="subtitle">Track and manage your team tasks with ease</p>
        </div>

        <div className="actions-bar-container">
          <div className="search-input-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              type="text"
              placeholder="Search tasks..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Create New Task</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="create-task-form">
            <h3 className="form-title">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-grid">
                <div className="form-group">
                    <div>
                        <label htmlFor="taskTitle" className="form-label">Task Title</label>
                        <input type="text" id="taskTitle" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="form-input" required />
                    </div>
                    <div>
                        <label htmlFor="taskDescription" className="form-label">Description</label>
                        <textarea id="taskDescription" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="form-textarea" rows={3} required ></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <div>
                        <label htmlFor="taskPriority" className="form-label">Priority</label>
                        <select id="taskPriority" value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })} className="form-select" >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="taskDeadline" className="form-label">Deadline</label>
                        <input type="date" id="taskDeadline" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} className="form-input" required />
                    </div>
                    <div>
                        <label htmlFor="taskTeam" className="form-label">Team</label>
                        <input type="text" id="taskTeam" value={newTask.team} onChange={(e) => setNewTask({ ...newTask, team: e.target.value })} className="form-input" required />
                    </div>
                    <div>
                        <label htmlFor="taskAssignee" className="form-label">Assign To</label>
                        <input type="text" id="taskAssignee" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} className="form-input" required />
                    </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-create">Create Task</button>
                <button type="button" className="btn btn-cancel" onClick={() => setShowCreateForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {filteredTasks.length > 0 ? (
          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div>
                  <div className="task-header">
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-actions">
                        <button className="btn-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil h-5 w-5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                        <button className="btn-icon delete" onClick={() => handleDeleteTask(task.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2 h-5 w-5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
                    </div>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className={`status-badge ${getStatusColor(task.status)}`}>{task.status.replace(/_/g, ' ')}</span>
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                  </div>
                  <div className="task-details">
                    <div className="detail-item"><span className="detail-label">Assigned to:</span><span className="detail-value">{task.assignedTo}</span></div>
                    <div className="detail-item"><span className="detail-label">Team:</span><span className="detail-value">{task.team}</span></div>
                    <div className="detail-item"><span className="detail-label">Deadline:</span><span className="detail-value">{task.deadline}</span></div>
                  </div>
                </div>

                <div className="task-actions-bottom">
                  <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)} className="status-select">
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                  <button className="btn btn-secondary">View Details</button>
                </div>

                {role === 'TeamLead' && task.status === 'DONE' && !task.certifiedBy && (
                  <button className="btn btn-certify" onClick={() => handleCertifyTask(task.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.5"/><path d="m11 15.91 2 2 4-4"/></svg>
                    <span>Certify Task</span>
                  </button>
                )}
                {task.certifiedBy && (
                  <div className="certified-message">
                    <p>Certified by: <strong>{task.certifiedBy}</strong></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tasks-message">
            No tasks found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;
