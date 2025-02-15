import { useEffect, useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { Tooltip } from 'react-tooltip'
import { Bar } from 'react-chartjs-2'
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js'
import { formatDuration } from '@renderer/utils/format-duration'
import { formatDate } from '@renderer/utils/format-date'
import { CustomSelect } from './Select'

// Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend)

interface HeatmapData {
  date: string
  duration: number // Duration in seconds
}

interface YearlyData {
  year: string
  hours: number
}

interface WeeklyData {
  day: string
  hours: string
  value: number
}

interface WeeklyActivityData {
  day: string
  value: number // Activity percentage (0-100)
}

export function Analytics(): JSX.Element {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([])
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [weeklyActivityData, setWeeklyActivityData] = useState<WeeklyActivityData[]>([])
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [totalHours, setTotalHours] = useState<number>(0)

  useEffect(() => {
    const fetchYearlyData = async (): Promise<void> => {
      const response = await window.api.getYearlyHoursSpent()
      setYearlyData(response.data)
      setSelectedYear(response.data[0]?.year || new Date().getFullYear().toString())
      setTotalHours(response.data[0]?.hours || 0)
    }
    fetchYearlyData()
  }, [])

  useEffect(() => {
    const fetchHeatmapData = async (): Promise<void> => {
      if (!selectedYear) return
      const response = await window.api.getHeatmapData(selectedYear)
      setHeatmapData(response.data)

      const yearData = yearlyData.find((item) => item.year === selectedYear)
      setTotalHours(yearData?.hours || 0)
    }
    fetchHeatmapData()
  }, [selectedYear, yearlyData])

  useEffect(() => {
    const fetchWeeklyData = async (): Promise<void> => {
      const response = await window.api.getWeeklyActivityData()
      setWeeklyData(response.data)
    }
    fetchWeeklyData()
  }, [])

  useEffect(() => {
    const fetchWeeklyActivityData = async (): Promise<void> => {
      const response = await window.api.getWeeklyActivity()
      setWeeklyActivityData(response.data)
    }
    fetchWeeklyActivityData()
  }, [])

  // Weekly Hours Chart Data
  const weeklyChartData = {
    labels: weeklyData.map((item) => item.day.slice(0, 3)),
    datasets: [
      {
        label: 'Hours Spent',
        data: weeklyData.map((item) => item.value),
        backgroundColor: 'rgba(107, 114, 128, 0.5)',
        borderColor: 'rgba(75, 85, 99, 1)',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  }

  const weeklyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        },
        ticks: {
          callback: (value): string => {
            const match = weeklyData.find((item) => item.value === value)
            return match ? match.hours : value
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem): string => {
            const match = weeklyData.find((item) => item.value === tooltipItem.raw)
            return match ? `Time Spent: ${match.hours}` : `Time Spent: ${tooltipItem.raw}`
          }
        }
      },
      legend: {
        display: false
      }
    }
  }

  // Weekly Activity Chart Data
  const weeklyActivityChartData = {
    labels: weeklyActivityData.map((item) => item.day.slice(0, 3)),
    datasets: [
      {
        label: 'Activity %',
        data: weeklyActivityData.map((item) => item.value),
        backgroundColor: 'rgba(107, 114, 128, 0.5)',
        borderColor: 'rgba(75, 85, 99, 1)',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  }

  const weeklyActivityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Ensure max value is 100%
        title: {
          display: true,
          text: 'Activity %'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem): string => {
            return `Activity: ${tooltipItem.raw}%`
          }
        }
      },
      legend: {
        display: false
      }
    }
  }

  return (
    <div>
      <div className="text-gray-600 mb-1 flex items-center justify-between">
        {totalHours} hours spent in {selectedYear}.
        {yearlyData.length > 0 && (
          <CustomSelect
            value={selectedYear}
            onChange={setSelectedYear}
            options={yearlyData.map((item) => ({
              label: item.year,
              value: item.year
            }))}
            className="w-32" // Adjust width if needed
          />
        )}
      </div>

      <div className="bg-white rounded-lg p-4 pb-0 border border-gray-300">
        <CalendarHeatmap
          showWeekdayLabels={true}
          startDate={new Date(parseInt(selectedYear), 0, 1)}
          endDate={new Date(parseInt(selectedYear), 11, 31)}
          values={heatmapData}
          gutterSize={2}
          classForValue={(value) => {
            if (!value) return 'fill-gray-200'
            const { duration } = value
            if (duration < 1 * 3600) return 'fill-gray-400'
            if (duration < 2 * 3600) return 'fill-gray-500'
            if (duration < 3 * 3600) return 'fill-gray-600'
            if (duration < 5 * 3600) return 'fill-gray-700'
            if (duration < 10 * 3600) return 'fill-gray-800'
            return 'fill-gray-900'
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
        <Tooltip id="heatmap-tooltip" />
      </div>

      <div className="grid gap-4 grid-cols-2 mt-4">
        <div className="bg-white rounded-lg p-4 border border-gray-300">
          <p className="text-gray-600 mb-2">Time Spent This Week</p>
          <div className="h-64">
            <Bar data={weeklyChartData} options={weeklyChartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-300">
          <p className="text-gray-600 mb-2">Weekly Activity %</p>
          <div className="h-64">
            <Bar data={weeklyActivityChartData} options={weeklyActivityChartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
