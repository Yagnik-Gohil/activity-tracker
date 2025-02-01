import { IProject, ITask, IResponse } from './interface'

declare global {
  interface Window {
    api: {
      getProjects: () => Promise<IResponse<IProject[]>>
      createProject: (name: string) => Promise<IResponse<IProject>>
      getTasks: (projectId: number) => Promise<IResponse<ITask[]>>
      createTask: (projectId: number, taskName: string) => Promise<IResponse<ITask>>
      updateProject: (id: number, name: string) => Promise<IResponse<IProject>>
      deleteProject: (id: number) => Promise<IResponse<boolean>>
      updateTask: (taskId: number, name: string) => Promise<IResponse<ITask>>
      deleteTask: (taskId: number) => Promise<IResponse<boolean>>
    }
  }
}

export {}
