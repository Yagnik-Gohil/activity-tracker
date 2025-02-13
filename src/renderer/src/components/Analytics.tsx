import { useEffect, useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Tooltip } from 'react-tooltip' // Import react-tooltip

interface HeatmapData {
  date: string
  duration: number // Duration in seconds
}

export function Analytics(): JSX.Element {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])

  useEffect(() => {
    const fetchHeatmapData = async (): Promise<void> => {
      const currentYear = new Date().getFullYear()
      const response = await window.api.getHeatmapData(currentYear)
      setHeatmapData(response.data)
    }

    fetchHeatmapData()
  }, [])

  // Function to format seconds into hours and minutes
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h`
    return `${minutes}m`
  }

  // Function to format date as "February 2nd"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = date.getDate()

    // Add ordinal suffix (st, nd, rd, th)
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
          ? 'nd'
          : day === 3 || day === 23
            ? 'rd'
            : 'th'

    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date)

    return `${month} ${day}${suffix}`
  }

  return (
    <div className="p-6">
      <p className="text-gray-600 mb-6">Task activity for {new Date().getFullYear()}.</p>

      <div className="bg-white rounded-lg p-4 pb-0 border border-gray-300">
        <CalendarHeatmap
          showWeekdayLabels={true}
          startDate={new Date(new Date().getFullYear(), 0, 1)}
          endDate={new Date(new Date().getFullYear(), 11, 31)}
          values={heatmapData}
          gutterSize={2}
          classForValue={(value) => {
            if (!value) return 'fill-gray-200' // No activity

            const { duration } = value

            if (duration < 1 * 3600) return 'fill-gray-400'
            if (duration < 2 * 3600) return 'fill-gray-500'
            if (duration < 3 * 3600) return 'fill-gray-600'
            if (duration < 5 * 3600) return 'fill-gray-700'
            if (duration < 10 * 3600) return 'fill-gray-800'

            return 'fill-gray-900' // For 10+ hours
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !value.date)
              return { 'data-tooltip-id': 'heatmap-tooltip', 'data-tooltip-content': 'No data' }

            const formattedTime = formatDuration(value.duration)
            const formattedDate = formatDate(value.date)

            return {
              'data-tooltip-id': 'heatmap-tooltip',
              'data-tooltip-content': `${formattedTime} spent on ${formattedDate}.`
            }
          }}
        />

        {/* Tooltip Component */}
        <Tooltip id="heatmap-tooltip" />
      </div>
    </div>
  )
}
