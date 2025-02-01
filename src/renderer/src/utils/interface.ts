export interface IProject {
  id: number
  name: string
  created_at?: string
  updated_at?: string
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ALL = 'all'
}

// Type for Task object
export interface ITask {
  id: number
  name: string
  description: string
  status: TaskStatus
  created_at?: string
  updated_at?: string
}

// Generic response type
export interface IResponse<T = unknown> {
  status: 0 | 1
  message: string
  data: T
}
