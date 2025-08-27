import { TaskStatus, TaskPriority, UserRole } from '../types';

// Date formatting helpers
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

// Status and priority helpers
export const getStatusColor = (status: TaskStatus): string => {
  const colors = {
    [TaskStatus.TODO]: '#F39C12',
    [TaskStatus.IN_PROGRESS]: '#4A90E2',
    [TaskStatus.DONE]: '#7ED321'
  };
  return colors[status] || '#7F8C8D';
};

export const getPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    [TaskPriority.LOW]: '#7ED321',
    [TaskPriority.MEDIUM]: '#F39C12',
    [TaskPriority.HIGH]: '#E74C3C'
  };
  return colors[priority] || '#7F8C8D';
};

export const getStatusLabel = (status: TaskStatus): string => {
  const labels = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done'
  };
  return labels[status] || status;
};

export const getPriorityLabel = (priority: TaskPriority): string => {
  const labels = {
    [TaskPriority.LOW]: 'Low',
    [TaskPriority.MEDIUM]: 'Medium',
    [TaskPriority.HIGH]: 'High'
  };
  return labels[priority] || priority;
};

// Role helpers
export const getRoleLabel = (role: UserRole): string => {
  const labels: { [key: string]: string } = {
    [UserRole.ADMIN]: 'Administrator',
    [UserRole.MANAGER]: 'Manager',
    [UserRole.TEAM_LEAD]: 'Team Lead',
    [UserRole.MEMBER]: 'Member'
  };
  return labels[role] || role;
};

export const canManageTeam = (userRole: UserRole): boolean => {
  return userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
};

export const canDeleteTeam = (userRole: UserRole): boolean => {
  return userRole === UserRole.ADMIN;
};

// String helpers
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Local storage helpers
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Array helpers
export const groupBy = <T, K extends string>(
  array: T[],
  key: keyof T
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]) as K;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Debounce helper
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Export all helpers
export default {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
  getRoleLabel,
  canManageTeam,
  canDeleteTeam,
  capitalizeFirst,
  truncateText,
  generateInitials,
  validateEmail,
  validatePassword,
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  groupBy,
  sortBy,
  debounce,
};