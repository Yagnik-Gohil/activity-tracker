import { ITask, TaskStatus } from '@renderer/utils/interface'
import { showSuccessToast, showErrorToast } from '@renderer/utils/toastHelper'

const taskAPI = {
  // Get all tasks for a project
  getTasks: async (projectId: number): Promise<ITask[]> => {
    try {
      const response = await window.api.getTasks(projectId)
      return response.data
    } catch (error) {
      console.error('Error fetching tasks:', error)
      showErrorToast('Failed to fetch tasks')
      throw new Error('Failed to fetch tasks')
    }
  },

  // Create a new task for a project
  createTask: async (
    projectId: number,
    taskName: string,
    description: string,
    status: TaskStatus
  ): Promise<ITask> => {
    try {
      const response = await window.api.createTask(projectId, taskName, description, status)
      showSuccessToast('Task created successfully')
      return response.data
    } catch (error) {
      console.error('Error creating task:', error)
      showErrorToast('Failed to create task')
      throw new Error('Failed to create task')
    }
  },

  // Update a task name
  updateTask: async (
    id: number,
    name: string,
    description: string,
    status: TaskStatus
  ): Promise<ITask> => {
    try {
      const response = await window.api.updateTask(id, name, description, status)
      showSuccessToast('Task updated successfully')
      return response.data
    } catch (error) {
      console.error('Error updating task:', error)
      showErrorToast('Failed to update task')
      throw new Error('Failed to update task')
    }
  },

  // Delete a task
  deleteTask: async (taskId: number): Promise<boolean> => {
    try {
      const response = await window.api.deleteTask(taskId)
      if (response.data) {
        showSuccessToast('Task deleted successfully')
      }
      return response.data
    } catch (error) {
      console.error('Error deleting task:', error)
      showErrorToast('Failed to delete task')
      throw new Error('Failed to delete task')
    }
  }
}

export default taskAPI
