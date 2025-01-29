import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Project } from '../main/db/entities/Project'
import { Task } from '../main/db/entities/Task'

// Custom APIs for renderer
const api = {
  // Fetch all projects
  getProjects: (): Promise<Project> => ipcRenderer.invoke('get-projects'),

  // Create a new project
  createProject: (name: string): Promise<void> => ipcRenderer.invoke('create-project', name),

  // Fetch tasks for a project
  getTasks: (projectId: number): Promise<Task> => ipcRenderer.invoke('get-tasks', projectId),

  // Create a new task for a project
  createTask: (projectId: number, taskName: string): Promise<void> =>
    ipcRenderer.invoke('create-task', { projectId, taskName })
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
