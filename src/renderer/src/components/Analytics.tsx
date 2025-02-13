import { useEffect, useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Tooltip } from 'react-tooltip' // Import react-tooltip

interface HeatmapData {
  date: string
  duration: number // Duration in seconds
}

interface YearlyData {
  year: string
  hours: number
}

export function Analytics(): JSX.Element {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([])
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [totalHours, setTotalHours] = useState<number>(0)

  // Fetch yearly data once
  useEffect(() => {
    const fetchYearlyData = async (): Promise<void> => {
      const response = await window.api.getYearlyHoursSpent()
      setYearlyData(response.data)
      setSelectedYear(response.data[0]?.year || new Date().getFullYear().toString()) // Default to latest year
      setTotalHours(response.data[0]?.hours || 0)
    }
    fetchYearlyData()
  }, [])

  // Fetch heatmap data when selectedYear changes
  useEffect(() => {
    const fetchHeatmapData = async (): Promise<void> => {
      if (!selectedYear) return
      const response = await window.api.getHeatmapData(selectedYear)
      setHeatmapData(response.data)

      // Update total hours for the selected year
      const yearData = yearlyData.find((item) => item.year === selectedYear)
      setTotalHours(yearData?.hours || 0)
    }

    fetchHeatmapData()
  }, [selectedYear, yearlyData])
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
    <div>
      {/* Display total hours spent for selected year */}
      <p className="text-gray-600 mb-1 flex items-center justify-between">
        {totalHours} hours spent in {selectedYear}.
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        >
          {yearlyData.map((item) => (
            <option key={item.year} value={item.year}>
              {item.year}
            </option>
          ))}
        </select>
      </p>

      <div className="bg-white rounded-lg p-4 pb-0 border border-gray-300">
        <CalendarHeatmap
          showWeekdayLabels={true}
          startDate={new Date(parseInt(selectedYear), 0, 1)}
          endDate={new Date(parseInt(selectedYear), 11, 31)}
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
