import { AppDataSource } from '../db/connection'
import { Task } from '../db/entities/Task'
import { Project } from '../db/entities/Project'

/**
 * Adds a new task under a project.
 */
export const addTask = async (projectId: number, name: string): Promise<Task> => {
  const taskRepo = AppDataSource.getRepository(Task)
  const projectRepo = AppDataSource.getRepository(Project)
  const project = await projectRepo.findOneBy({ id: projectId })

  if (!project) throw new Error('Project not found')

  const task = taskRepo.create({ name, project })
  await taskRepo.save(task)
  return task
}

/**
 * Fetch all tasks for a given project.
 */
export const getTasksByProject = async (projectId: number): Promise<Task[]> => {
  return await AppDataSource.getRepository(Task).find({
    where: { project: { id: projectId } }
  })
}
