import { TimerState } from '@renderer/store/timerSlice'
import { IProject, ITask, IResponse, TaskStatus } from './interface'

declare global {
  interface Window {
    api: {
      getProjects: () => Promise<IResponse<IProject[]>>
      createProject: (name: string) => Promise<IResponse<IProject>>
      getTasks: (projectId: number) => Promise<IResponse<ITask[]>>
      createTask: (
        projectId: number,
        taskName: string,
        description: string,
        status: TaskStatus
      ) => Promise<IResponse<ITask>>
      updateProject: (id: number, name: string) => Promise<IResponse<IProject>>
      deleteProject: (id: number) => Promise<IResponse<boolean>>
      updateTask: (
        taskId: number,
        name: string,
        description: string,
        status: TaskStatus
      ) => Promise<IResponse<ITask>>
      deleteTask: (taskId: number) => Promise<IResponse<boolean>>
      getTotalTimeToday: () => Promise<IResponse<number>>
      updateTimerState: (newState: {
        isRunning: boolean
        taskId: number
        projectId: number
        taskName: string | null
        projectName: string | null
      }) => void
      getHeatmapData: (year: string) => Promise<IResponse<{ date: string; duration: number }[]>>
      getTimerState: () => Promise<TimerState>
      getYearlyHoursSpent: () => Promise<IResponse<{ year: string; hours: number }[]>>
      getWeeklyActivityData: () => Promise<
        IResponse<{ day: string; hours: string; value: number }[]>
      >
      getWeeklyActivity: () => Promise<IResponse<{ day: string; value: number }[]>>
    }
  }
}

export {}
