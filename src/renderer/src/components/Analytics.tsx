import { useEffect, useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'

interface HeatmapData {
  date: string
  count: number
}

export function Analytics(): JSX.Element {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  useEffect(() => {
    const fetchHeatmapData = async (): Promise<void> => {
      const currentYear = new Date().getFullYear()
      const startDate = new Date(currentYear, 0, 1) // January 1st
      const endDate = new Date(currentYear, 11, 31) // December 31st

      const formatDate = (date: Date): string => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
          .getDate()
          .toString()
          .padStart(2, '0')}`
      }

      const response = await window.api.getHeatmapData(formatDate(startDate), formatDate(endDate))

      setHeatmapData(response.data)
    }

    fetchHeatmapData()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Yearly Analytics</h2>
      <p className="text-gray-600 mb-6">Task activity for {new Date().getFullYear()}.</p>

      <div className="bg-white rounded-lg p-4 pb-0 border border-gray-300">
        <CalendarHeatmap
          showWeekdayLabels={true}
          startDate={new Date(new Date().getFullYear(), 0, 1)}
          endDate={new Date(new Date().getFullYear(), 11, 31)}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return 'fill-gray-200' // No activity

            const { count } = value

            if (count < 1) return 'fill-gray-400'
            if (count < 2) return 'fill-gray-500'
            if (count < 3) return 'fill-gray-600'
            if (count < 5) return 'fill-gray-700'
            if (count < 10) return 'fill-gray-800'

            return 'fill-gray-900' // For 10+
          }}
        />
      </div>
    </div>
  )
}
