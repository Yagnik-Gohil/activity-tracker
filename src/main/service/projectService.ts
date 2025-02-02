import { AppDataSource } from '../db/connection'
import { Project } from '../db/entities/Project'

/**
 * Adds a new project to the database.
 * @param {string} name - The name of the project.
 * @returns {Promise<Project>} - The created project.
 */
export const addProject = async (name: string): Promise<Project> => {
  const projectRepo = AppDataSource.getRepository(Project)
  const project = projectRepo.create({ name })
  return await projectRepo.save(project)
}

/**
 * Fetches all projects along with their associated tasks.
 * @returns {Promise<Project[]>} - List of all projects with their tasks.
 */
export const getProjects = async (): Promise<Project[]> => {
  return await AppDataSource.getRepository(Project).find()
}

/**
 * Fetches a project by its ID along with its associated tasks.
 * @param {number} id - The ID of the project to fetch.
 * @returns {Promise<Project | null>} - The project if found, otherwise null.
 */
export const getProjectById = async (id: number): Promise<Project | null> => {
  return await AppDataSource.getRepository(Project).findOne({
    where: { id },
    relations: ['tasks']
  })
}

/**
 * Updates an existing project by its ID.
 * @param {number} id - The ID of the project to update.
 * @param {string} name - The new name for the project.
 * @returns {Promise<Project | null>} - The updated project or null if not found.
 */
export const updateProject = async (id: number, name: string): Promise<Project | null> => {
  const projectRepo = AppDataSource.getRepository(Project)
  const project = await projectRepo.findOneBy({ id })

  if (!project) return null

  project.name = name
  return await projectRepo.save(project)
}

/**
 * Deletes a project by its ID.
 * @param {number} id - The ID of the project to delete.
 * @returns {Promise<boolean>} - Returns true if the project was deleted, false if not found.
 */
export const deleteProject = async (id: number): Promise<boolean> => {
  const projectRepo = AppDataSource.getRepository(Project)
  const result = await projectRepo.delete(id)

  return result.affected !== 0
}

/**
 * Resets the project's duration for the current day.
 * @param {number} id - The ID of the project to reset the duration for.
 * @returns {Promise<Project | null>} - The updated project with the reset duration.
 */
export const resetProjectDurationForToday = async (): Promise<void> => {
  const projectRepo = AppDataSource.getRepository(Project)

  // Get today's date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split('T')[0]

  // Use query builder to update all projects where last_updated is not today's date
  await projectRepo
    .createQueryBuilder()
    .update(Project)
    .set({
      today_time: 0, // Reset the today_time to 0
      last_updated: currentDate // Set last_updated to today's date
    })
    .where('last_updated != :currentDate', { currentDate }) // Only update projects where last_updated is not today
    .execute()
}
/**
 * Gets the total time spent today across all projects using the query builder.
 * @returns {Promise<number>} - The total time spent today in seconds.
 */
export const getTotalTimeToday = async (): Promise<number> => {
  const projectRepo = AppDataSource.getRepository(Project)

  // Use query builder to sum up the today_time from all projects
  const result = await projectRepo
    .createQueryBuilder('project')
    .select('SUM(project.today_time)', 'totalTimeToday') // Sum the today_time column
    .getRawOne() // Get the raw result

  // Return the totalTimeToday (or 0 if no result)
  return result.totalTimeToday ? parseInt(result.totalTimeToday, 10) : 0
}
