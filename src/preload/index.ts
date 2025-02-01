import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ErrorResponse, SuccessResponse } from '../main/utils/interface'

// Custom APIs for renderer
const api = {
  // Fetch all projects
  getProjects: (): Promise<SuccessResponse | ErrorResponse> => ipcRenderer.invoke('get-projects'),

  // Create a new project
  createProject: (name: string): Promise<SuccessResponse | ErrorResponse> =>
    ipcRenderer.invoke('create-project', name),

  // Fetch tasks for a project
  getTasks: (projectId: number): Promise<SuccessResponse | ErrorResponse> =>
    ipcRenderer.invoke('get-tasks', projectId),

  // Create a new task for a project
  createTask: (projectId: number, taskName: string): Promise<SuccessResponse | ErrorResponse> =>
    ipcRenderer.invoke('create-task', { projectId, taskName }),

  // Update project name
  updateProject: (id: number, name: string): Promise<SuccessResponse | ErrorResponse> =>
    ipcRenderer.invoke('update-project', { id, name }),

  // Delete a project
  deleteProject: (id: number): Promise<SuccessResponse | ErrorResponse> =>
    ipcRenderer.invoke('delete-project', id),

  // Update task name
  updateTask: (taskId: number, name: string): Promise<SuccessResponse | ErrorResponse> =>
    ipcRenderer.invoke('update-task', { taskId, name }),

  // Delete task
  deleteTask: (taskId: number): Promise<SuccessResponse | ErrorResponse> =>
    ipcRenderer.invoke('delete-task', taskId)
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
