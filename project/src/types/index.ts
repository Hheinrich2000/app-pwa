export type UserRole = 'worker' | 'admin' | 'god';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  password?: string;
  worker_code?: string;
  workplace_id?: string;
  assigned_hours?: number;
  admin_id?: string;
  created_at: Date;
}

export interface Workplace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  admin_id: string;
  created_at: Date;
}

export interface WorkerAssignment {
  id: string;
  worker_id: string;
  workplace_id: string;
  assigned_hours: number;
  schedule?: string; // JSON string
  created_at: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  workplace_id: string;
  assigned_to: string; // worker_id
  due_date?: Date;
  status: 'pending' | 'completed';
  created_by: string; // admin_id
  created_at: Date;
  completed_at?: Date;
}

export interface CheckIn {
  id: string;
  worker_id: string;
  workplace_id: string;
  type: 'in' | 'out';
  timestamp: Date;
  latitude: number;
  longitude: number;
  note?: string;
  photo_url?: string;
}

export interface WorkerNote {
  id: string;
  worker_id: string;
  workplace_id: string;
  note: string;
  photo_url?: string;
  timestamp: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}