import { ipcMain } from 'electron'
import {
  addTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask
} from '../service/taskService'
import { errorResponse, successResponse } from '../utils/responseHandler'
import { TaskStatus } from '../utils/enum'

/**
 * Handle adding a new task to a project.
 */
ipcMain.handle('create-task', async (_, data) => {
  try {
    const newTask = await addTask(data)
    return successResponse('Task created successfully', newTask)
  } catch (error) {
    console.error('❌ Error creating task:', error)
    return errorResponse('Failed to create task')
  }
})

/**
 * Handle fetching all tasks for a specific project.
 */
ipcMain.handle('get-tasks-by-project', async (_, projectId: number) => {
  try {
    const tasks = await getTasksByProject(projectId)
    return successResponse('Tasks fetched successfully', tasks)
  } catch (error) {
    console.error('❌ Error fetching tasks:', error)
    return errorResponse('Failed to fetch tasks')
  }
})

/**
 * Handle fetching a task by its ID.
 */
ipcMain.handle('get-task-by-id', async (_, taskId: number) => {
  try {
    const task = await getTaskById(taskId)
    if (!task) {
      return errorResponse('Task not found')
    }
    return successResponse('Task fetched successfully', task)
  } catch (error) {
    console.error('❌ Error fetching task:', error)
    return errorResponse('Failed to fetch task')
  }
})

/**
 * Handle updating a task.
 */
ipcMain.handle(
  'update-task',
  async (_, data: { id: number; name: string; description: string; status: TaskStatus }) => {
    try {
      const updatedTask = await updateTask(data.id, data.name, data.description, data.status)
      if (!updatedTask) {
        return errorResponse('Task not found or update failed')
      }
      return successResponse('Task updated successfully', updatedTask)
    } catch (error) {
      console.error('❌ Error updating task:', error)
      return errorResponse('Failed to update task')
    }
  }
)

/**
 * Handle deleting a task.
 */
ipcMain.handle('delete-task', async (_, taskId: number) => {
  try {
    const isDeleted = await deleteTask(taskId)
    if (!isDeleted) {
      return errorResponse('Task not found or delete failed')
    }
    return successResponse('Task deleted successfully')
  } catch (error) {
    console.error('❌ Error deleting task:', error)
    return errorResponse('Failed to delete task')
  }
})
