import { AppDataSource } from '../db/connection'
import { Activity } from '../db/entities/Activity'

/**
 * Fetches activities and aggregates durations per date for the CalendarHeatmap.
 * Converts seconds to hours.
 * @returns {Promise<{ date: string, count: number }[]>}
 */
export const getActivityHeatmapData = async (
  year: number
): Promise<{ date: string; duration: number }[]> => {
  const activityRepo = AppDataSource.getRepository(Activity)

  // Aggregate and convert duration from seconds to hours
  const heatmapData = await activityRepo
    .createQueryBuilder('activity')
    .select(['activity.date as date', 'SUM(activity.duration) as duration'])
    .where("strftime('%Y', activity.date) = :year", { year: year.toString() })
    .groupBy('activity.date')
    .orderBy('activity.date', 'ASC')
    .getRawMany()

  return heatmapData
}
