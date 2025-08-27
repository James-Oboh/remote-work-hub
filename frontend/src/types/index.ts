// src/types/index.ts

// --- User related types ---
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  teams?: Team[];
  assignedTasks?: Task[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TEAM_LEAD = 'TEAM_LEAD',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER'
}

// --- Team related types ---
export interface Team {
  id: number;
  name: string;
  description?: string;
  members: User[];
  manager?: User;
  tasks: Task[];
  createdAt: string;
}

// --- Task related types ---
export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  team: Team;
  assignedTo?: User;
  certifiedBy?: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

// --- Auth related types ---
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email?: string;
  role?: string;
  message?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}



export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email?: string;
  role?: string;
  message?: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'date';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// UI types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // Corrected type for children
}

// Dashboard types
export interface DashboardStats {
  activeTeams: number;
  pendingTasks: number;
  completedToday: number;
  totalMembers: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  time: string;
  user: string;
  type: 'task' | 'team' | 'user';
}

// Filter and search types
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  teamId?: number;
  assignedToId?: number;
  deadline?: string;
}

export interface TeamFilters {
  managerId?: number;
  memberId?: number;
  search?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

  
  /* --- Mock API Service ---
// Simulating API calls to avoid actual network requests in a self-contained app.
class MockAuthAPI {
  async login(credentials: LoginRequest): Promise<{ data: AuthResponse }> {
      console.log("Mock API call: login with", credentials);
      // Simulate a successful API response with the data nested inside
      const mockResponseData: AuthResponse = {
          token: "mock-token-123",
          username: credentials.username,
          email: "user@example.com",
          role: "ADMIN",
          message: "Login successful"
      };
      return { data: mockResponseData };
  }
}
const authAPI = new MockAuthAPI();

*/

