import { AppDataSource } from '../db/connection'
import { Activity } from '../db/entities/Activity'

/**
 * Fetches activities and aggregates durations per date for the CalendarHeatmap.
 * Converts seconds to hours.
 * @returns {Promise<{ date: string, count: number }[]>}
 */
export const getActivityHeatmapData = async (): Promise<{ date: string; count: number }[]> => {
  const activityRepo = AppDataSource.getRepository(Activity)

  // Aggregate and convert duration from seconds to hours
  const heatmapData = await activityRepo
    .createQueryBuilder('activity')
    .select('activity.date', 'date')
    .addSelect('ROUND(SUM(activity.duration) / 3600, 2)', 'count') // Convert seconds to hours
    .groupBy('activity.date')
    .orderBy('activity.date', 'ASC')
    .getRawMany()

  return heatmapData // Returns an array of { date: 'YYYY-MM-DD', count: totalHours }
}
