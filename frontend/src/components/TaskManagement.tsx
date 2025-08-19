import React, { useState } from 'react';
import './TaskManagement.css';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTo: string;
  team: string;
  deadline: string;
  completed: boolean;
}

const TaskManagement = () => {
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
      completed: false
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
      completed: false
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
      completed: true
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as const,
    assignedTo: '',
    team: '',
    deadline: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO': return '#F39C12';
      case 'IN_PROGRESS': return '#4A90E2';
      case 'DONE': return '#7ED321';
      default: return '#7F8C8D';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '#E74C3C';
      case 'MEDIUM': return '#F39C12';
      case 'LOW': return '#7ED321';
      default: return '#7F8C8D';
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      status: 'TODO',
      priority: newTask.priority,
      assignedTo: newTask.assignedTo,
      team: newTask.team,
      deadline: newTask.deadline,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'MEDIUM',
      assignedTo: '',
      team: '',
      deadline: ''
    });
    setShowCreateForm(false);
  };

  const handleStatusChange = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, completed: newStatus === 'DONE' }
        : task
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
          <p className="subtitle">Track and manage your team tasks</p>
        </div>

        <div className="actions-bar">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            <span className="btn-icon">➕</span>
            Create New Task
          </button>
        </div>

        {showCreateForm && (
          <div className="create-task-form card">
            <h3>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="taskTitle" className="form-label">Task Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter task title"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="taskDescription" className="form-label">Description</label>
                <textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="form-input"
                  placeholder="Enter task description"
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="taskPriority" className="form-label">Priority</label>
                  <select
                    id="taskPriority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="form-input"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="taskDeadline" className="form-label">Deadline</label>
                  <input
                    type="date"
                    id="taskDeadline"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="taskTeam" className="form-label">Team</label>
                  <input
                    type="text"
                    id="taskTeam"
                    value={newTask.team}
                    onChange={(e) => setNewTask({...newTask, team: e.target.value})}
                    className="form-input"
                    placeholder="Enter team name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="taskAssignee" className="form-label">Assign To</label>
                  <input
                    type="text"
                    id="taskAssignee"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="form-input"
                    placeholder="Enter assignee name"
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create Task</button>
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

        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card card">
              <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-actions">
                  <button className="btn-icon">✏️</button>
                  <button 
                    className="btn-icon delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    ��️
                  </button>
                </div>
              </div>
              
              <p className="task-description">{task.description}</p>
              
              <div className="task-meta">
                <div className="task-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status}
                  </span>
                </div>
                
                <div className="task-priority">
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              
              <div className="task-details">
                <div className="detail-item">
                  <span className="detail-label">Assigned to:</span>
                  <span className="detail-value">{task.assignedTo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Team:</span>
                  <span className="detail-value">{task.team}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Deadline:</span>
                  <span className="detail-value">{task.deadline}</span>
                </div>
              </div>
              
              <div className="task-actions-bottom">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                  className="status-select"
                  style={{ borderColor: getStatusColor(task.status) }}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
                
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;