import { AppDataSource } from '../db/connection'
import { Activity } from '../db/entities/Activity'

/**
 * Fetches activities and aggregates durations per date for the CalendarHeatmap.
 * Converts seconds to hours.
 * @returns {Promise<{ date: string, count: number }[]>}
 */
export const getActivityHeatmapData = async (
  year: string
): Promise<{ date: string; duration: number }[]> => {
  const activityRepo = AppDataSource.getRepository(Activity)

  // Aggregate and convert duration from seconds to hours
  const heatmapData = await activityRepo
    .createQueryBuilder('activity')
    .select(['activity.date as date', 'SUM(activity.duration) as duration'])
    .where("strftime('%Y', activity.date) = :year", { year: year })
    .groupBy('activity.date')
    .orderBy('activity.date', 'ASC')
    .getRawMany()

  return heatmapData
}

/**
 * Fetches total hours spent per year.
 * Converts duration from seconds to hours (rounded down).
 * @returns {Promise<{ year: string, hoursSpent: number }[]>}
 */
export const getYearlyHoursSpent = async (): Promise<{ year: string; hours: number }[]> => {
  const activityRepo = AppDataSource.getRepository(Activity)

  // Aggregate duration per year and convert it to hours (integer)
  const yearlyData = await activityRepo
    .createQueryBuilder('activity')
    .select([
      "strftime('%Y', activity.date) as year",
      'FLOOR(SUM(activity.duration) / 3600) as hours'
    ])
    .groupBy("strftime('%Y', activity.date)")
    .orderBy('year', 'DESC')
    .getRawMany()

  return yearlyData
}
