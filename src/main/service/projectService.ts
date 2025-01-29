import { AppDataSource } from '../db/connection'
import { Project } from '../db/entities/Project'

/**
 * Adds a new project to the database.
 */
export const addProject = async (name: string): Promise<Project> => {
  const projectRepo = AppDataSource.getRepository(Project)
  const project = projectRepo.create({ name })
  await projectRepo.save(project)
  return project
}

/**
 * Fetch all projects with tasks.
 */
export const getProjects = async (): Promise<Project[]> => {
  return await AppDataSource.getRepository(Project).find({ relations: ['tasks'] })
}
