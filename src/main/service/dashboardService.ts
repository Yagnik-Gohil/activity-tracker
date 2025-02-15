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

export const getWeeklyTimeSpentData = async (): Promise<
  { day: string; hours: string; value: number }[]
> => {
  const activityRepo = AppDataSource.getRepository(Activity)

  return await activityRepo.query(`
      WITH days AS (
        SELECT 'Sunday' AS day UNION ALL
        SELECT 'Monday' UNION ALL
        SELECT 'Tuesday' UNION ALL
        SELECT 'Wednesday' UNION ALL
        SELECT 'Thursday' UNION ALL
        SELECT 'Friday' UNION ALL
        SELECT 'Saturday'
      ),
      activity_data AS (
        SELECT 
          CASE strftime('%w', activity.date)
            WHEN '0' THEN 'Sunday'
            WHEN '1' THEN 'Monday'
            WHEN '2' THEN 'Tuesday'
            WHEN '3' THEN 'Wednesday'
            WHEN '4' THEN 'Thursday'
            WHEN '5' THEN 'Friday'
            WHEN '6' THEN 'Saturday'
          END AS day,
          printf('%02d:%02d', SUM(activity.duration) / 3600, (SUM(activity.duration) % 3600) / 60) AS hours,
          ROUND(SUM(activity.duration) / 3600.0, 2) AS value  -- Convert seconds to hours as decimal
        FROM activity
        WHERE activity.date BETWEEN DATE('now', 'weekday 0', '-6 days') AND DATE('now', 'weekday 0')
        GROUP BY day
      )
      SELECT 
        days.day, 
        COALESCE(activity_data.hours, '00:00') AS hours,
        COALESCE(activity_data.value, 0) AS value  -- Ensure missing days have 0 hours
      FROM days
      LEFT JOIN activity_data ON days.day = activity_data.day
      ORDER BY 
        CASE days.day 
          WHEN 'Sunday' THEN 0 
          WHEN 'Monday' THEN 1 
          WHEN 'Tuesday' THEN 2 
          WHEN 'Wednesday' THEN 3 
          WHEN 'Thursday' THEN 4 
          WHEN 'Friday' THEN 5 
          WHEN 'Saturday' THEN 6 
        END;
  `)
}

export const getWeeklyActivity = async (): Promise<{ day: string; value: number }[]> => {
  const activityRepo = AppDataSource.getRepository(Activity)

  return await activityRepo.query(`
      WITH days AS (
        SELECT 'Sunday' AS day UNION ALL
        SELECT 'Monday' UNION ALL
        SELECT 'Tuesday' UNION ALL
        SELECT 'Wednesday' UNION ALL
        SELECT 'Thursday' UNION ALL
        SELECT 'Friday' UNION ALL
        SELECT 'Saturday'
      ),
      activity_data AS (
        SELECT 
          CASE strftime('%w', activity.date)
            WHEN '0' THEN 'Sunday'
            WHEN '1' THEN 'Monday'
            WHEN '2' THEN 'Tuesday'
            WHEN '3' THEN 'Wednesday'
            WHEN '4' THEN 'Thursday'
            WHEN '5' THEN 'Friday'
            WHEN '6' THEN 'Saturday'
          END AS day,
          SUM(activity.duration) AS total_active_seconds,
          SUM(activity.idle_duration) AS total_idle_seconds
        FROM activity
        WHERE activity.date BETWEEN DATE('now', 'weekday 0', '-6 days') AND DATE('now', 'weekday 0')
        GROUP BY day
      )
      SELECT 
        days.day, 
        COALESCE(
          ROUND((total_active_seconds * 100.0) / NULLIF((total_active_seconds + total_idle_seconds), 0), 2),
          0
        ) AS value
      FROM days
      LEFT JOIN activity_data ON days.day = activity_data.day
      ORDER BY 
        CASE days.day 
          WHEN 'Sunday' THEN 0 
          WHEN 'Monday' THEN 1 
          WHEN 'Tuesday' THEN 2 
          WHEN 'Wednesday' THEN 3 
          WHEN 'Thursday' THEN 4 
          WHEN 'Friday' THEN 5 
          WHEN 'Saturday' THEN 6 
        END;
  `)
}
