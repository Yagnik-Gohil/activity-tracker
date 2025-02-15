import { AppDataSource } from '../db/connection'
import { Activity } from '../db/entities/Activity'
import { Project } from '../db/entities/Project'

/**
 * Adds or updates the activity record for a specific task and project.
 * @param {number} taskId - The ID of the task for the activity.
 * @param {number} projectId - The ID of the project associated with the task.
 * @param {number} timeSpent - The total time spent on the task (in seconds).
 * @returns {Promise<Activity>} - The added or updated activity record.
 */
export const addOrUpdateActivity = async (
  taskId: number,
  projectId: number,
  timeSpent: number,
  idleTime: number
): Promise<Activity> => {
  const activityRepo = AppDataSource.getRepository(Activity)
  const projectRepo = AppDataSource.getRepository(Project)

  // Get today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().split('T')[0]

  // Check if an activity already exists for today for the given task
  const existingActivity = await activityRepo.findOne({
    where: {
      task: { id: taskId },
      date: todayDate // Use today's date (YYYY-MM-DD)
    }
  })

  // Find the project using projectId
  const project = await projectRepo.findOne({ where: { id: projectId } })

  if (!project) {
    throw new Error('Project not found for the given projectId')
  }

  // Check if the project needs to be reset (i.e., if the date has changed)
  if (project.last_updated !== todayDate) {
    // Reset the project’s today_time if the day has changed
    project.today_time = 0
    project.last_updated = todayDate // Update to today's date
    await projectRepo.save(project)
  }

  if (existingActivity) {
    // If an activity exists for today, update the duration
    existingActivity.duration += timeSpent
    existingActivity.idle_duration += idleTime
    const updatedActivity = await activityRepo.save(existingActivity)

    // Update the total time spent in the project today
    project.today_time += timeSpent // Adding the time spent to the project’s today_time
    await projectRepo.save(project)

    return updatedActivity
  } else {
    // If no existing activity for today, create a new activity record
    const activity = activityRepo.create({
      task: { id: taskId },
      duration: timeSpent, // Initialize with the given time spent
      date: todayDate // Today's date in YYYY-MM-DD format
    })

    const newActivity = await activityRepo.save(activity)

    // Update the total time spent in the project today
    project.today_time += timeSpent // Adding the time spent to the project’s today_time
    await projectRepo.save(project)

    return newActivity
  }
}
