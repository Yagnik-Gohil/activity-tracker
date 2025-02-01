import { AppDataSource } from '../db/connection'
import { Task } from '../db/entities/Task'
import { Project } from '../db/entities/Project'
import { TaskStatus } from '../utils/enum'
import { IAddTask } from '../utils/interface'

/**
 * Adds a new task under a project.
 * @param {number} projectId - The ID of the project.
 * @param {string} name - The name of the task.
 * @returns {Promise<Task>} - The created task.
 */
export const addTask = async (data: IAddTask): Promise<Task> => {
  const taskRepo = AppDataSource.getRepository(Task)
  const projectRepo = AppDataSource.getRepository(Project)
  const project = await projectRepo.findOne({ where: { id: data.projectId } })
  if (!project) throw new Error('Project not found')

  const task = taskRepo.create({
    name: data.name,
    project,
    description: data.description,
    status: data.status
  })

  await taskRepo.save(task)
  return task
}

/**
 * Fetch all tasks for a given project.
 * @param {number} projectId - The ID of the project to fetch tasks for.
 * @returns {Promise<Task[]>} - List of tasks for the given project.
 */
export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
  return await AppDataSource.getRepository(Task).find({
    where: { project: { id: projectId } }
  })
}

/**
 * Fetch a task by its ID.
 * @param {number} taskId - The ID of the task to fetch.
 * @returns {Promise<Task | null>} - The task if found, otherwise null.
 */
export const getTaskById = async (taskId: number): Promise<Task | null> => {
  return await AppDataSource.getRepository(Task).findOne({
    where: { id: taskId }
  })
}

/**
 * Updates a task by its ID.
 * @param {number} taskId - The ID of the task to update.
 * @param {string} name - The new name for the task.
 * @param {string} description - The new description for the task.
 * @param {string} status - The updated status of the task.
 * @returns {Promise<Task | null>} - The updated task or null if not found.
 */
export const updateTask = async (
  id: number,
  name: string,
  description: string,
  status: TaskStatus
): Promise<Task | null> => {
  const taskRepo = AppDataSource.getRepository(Task)
  const task = await taskRepo.findOneBy({ id: id })

  if (!task) return null

  task.name = name
  task.description = description
  task.status = status
  return await taskRepo.save(task)
}

/**
 * Deletes a task by its ID.
 * @param {number} taskId - The ID of the task to delete.
 * @returns {Promise<boolean>} - Returns true if the task was deleted, false if not found.
 */
export const deleteTask = async (taskId: number): Promise<boolean> => {
  const taskRepo = AppDataSource.getRepository(Task)
  const result = await taskRepo.delete(taskId)

  return result.affected !== 0
}
