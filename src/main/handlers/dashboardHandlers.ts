import { ipcMain } from 'electron'
import { getActivityHeatmapData } from '../service/dashboardService'
import { successResponse, errorResponse } from '../utils/responseHandler'

/**
 * Handles fetching heatmap data within a date range.
 */
ipcMain.handle(
  'get-heatmap-data',
  async (_, { startDate, endDate }: { startDate: string; endDate: string }) => {
    try {
      const heatmapData = await getActivityHeatmapData(startDate, endDate)
      return successResponse('Heatmap data fetched successfully', heatmapData)
    } catch (error) {
      console.error('❌ Error fetching heatmap data:', error)
      return errorResponse('Failed to fetch heatmap data')
    }
  }
)
