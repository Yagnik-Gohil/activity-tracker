import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ErrorResponse, SuccessResponse } from '../main/utils/interface'
import { Project } from '../main/db/entities/Project'
import { Task } from '../main/db/entities/Task'
import { TaskStatus } from '../main/utils/enum'

// Custom APIs for renderer
const api = {
  // 🚀 Fetch the current timer state from the main process
  getTimerState: (): Promise<{
    isRunning: boolean
    taskId: number | null
    projectId: number | null
    elapsedTime: number
  }> => ipcRenderer.invoke('get-timer-state'),

  // Fetch all projects
  getProjects: (): Promise<SuccessResponse<Project[]> | ErrorResponse> =>
    ipcRenderer.invoke('get-projects'),

  // Create a new project
  createProject: (name: string): Promise<SuccessResponse<Project> | ErrorResponse> =>
    ipcRenderer.invoke('create-project', name),

  // Fetch tasks for a project
  getTasks: (projectId: number): Promise<SuccessResponse<Task[]> | ErrorResponse> =>
    ipcRenderer.invoke('get-tasks-by-project', projectId),

  // Create a new task for a project
  createTask: (
    projectId: number,
    name: string,
    description: string,
    status: TaskStatus
  ): Promise<SuccessResponse<Task> | ErrorResponse> =>
    ipcRenderer.invoke('create-task', { projectId, name, description, status }),

  // Update project name
  updateProject: (id: number, name: string): Promise<SuccessResponse<Project> | ErrorResponse> =>
    ipcRenderer.invoke('update-project', { id, name }),

  // Delete a project
  deleteProject: (id: number): Promise<SuccessResponse<boolean> | ErrorResponse> =>
    ipcRenderer.invoke('delete-project', id),

  // Update task name
  updateTask: (
    id: number,
    name: string,
    description: string,
    status: TaskStatus
  ): Promise<SuccessResponse<Task> | ErrorResponse> =>
    ipcRenderer.invoke('update-task', { id, name, description, status }),

  // Delete task
  deleteTask: (taskId: number): Promise<SuccessResponse<void> | ErrorResponse> =>
    ipcRenderer.invoke('delete-task', taskId),

  // Get total time spent today
  getTotalTimeToday: (): Promise<SuccessResponse<number> | ErrorResponse> =>
    ipcRenderer.invoke('get-total-time-today'),

  // 🚀 New method to update the timer state
  updateTimerState: (newState: {
    isRunning: boolean
    taskId: number
    projectId: number
    taskName: string
    projectName: string
  }): Promise<void> => ipcRenderer.invoke('timer-state-changed', newState),

  getHeatmapData: (
    year: number
  ): Promise<SuccessResponse<{ date: string; duration: number }[]> | ErrorResponse> =>
    ipcRenderer.invoke('get-heatmap-data', { year })
}

// Use `contextBridge` to expose Electron APIs to the renderer only if context isolation is enabled
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
