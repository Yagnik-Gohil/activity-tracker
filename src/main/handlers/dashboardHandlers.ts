import { ipcMain } from 'electron'
import {
  getActivityHeatmapData,
  getWeeklyActivityData,
  getYearlyHoursSpent
} from '../service/dashboardService'
import { successResponse, errorResponse } from '../utils/responseHandler'

/**
 * Handles fetching heatmap data within a date range.
 */
ipcMain.handle('get-heatmap-data', async (_, { year }: { year: string }) => {
  try {
    const heatmapData = await getActivityHeatmapData(year)
    return successResponse('Heatmap data fetched successfully', heatmapData)
  } catch (error) {
    console.error('❌ Error fetching heatmap data:', error)
    return errorResponse('Failed to fetch heatmap data')
  }
})

ipcMain.handle('get-yearly-hours-spent', async () => {
  try {
    const data = await getYearlyHoursSpent()
    return successResponse('Yearly Hours spent data fetched successfully', data)
  } catch (error) {
    console.error('❌ Error fetching Yearly Hours spent data:', error)
    return errorResponse('Failed to fetch Yearly Hours spent data')
  }
})

ipcMain.handle('get-weekly-data', async () => {
  try {
    const data = await getWeeklyActivityData()
    return successResponse('Weekly data fetched successfully', data)
  } catch (error) {
    console.error('❌ Error fetching Weekly data:', error)
    return errorResponse('Failed to fetch Weekly data')
  }
})
