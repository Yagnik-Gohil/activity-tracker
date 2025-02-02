import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store' // Adjust path as necessary
import {
  startTimer,
  stopTimer,
  updateElapsedTime,
  setTotalTimeToday
} from '@renderer/store/timerSlice' // Adjust path as necessary
import { Play, StopCircle } from 'lucide-react' // Assuming you have these icons installed
import { showErrorToast } from '@renderer/utils/toastHelper'

const formatTime = (seconds: number): string => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${secs}`
}

export function TimerWidget(): JSX.Element {
  const dispatch = useDispatch()
  const timerState = useSelector((state: RootState) => state.timer)
  const { isRunning, taskName, projectName, elapsedTime, taskId, projectId } = timerState

  // Handle start/stop of the timer
  const handleToggleTimer = (): void => {
    if (!taskId) {
      // Show toast notification if no task is selected
      showErrorToast('Please select a task.')
      return
    }

    if (isRunning) {
      dispatch(stopTimer()) // Stop the timer if it's running
    } else {
      // Start the timer with selected project/task data
      if (taskId && projectId && taskName && projectName) {
        dispatch(
          startTimer({
            projectId: projectId,
            taskId: taskId,
            taskName: taskName,
            projectName: projectName
          })
        )
      } else {
        showErrorToast('Please select both task and project before starting the timer.')
      }
    }
  }

  // Update elapsed time every second if the timer is running
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isRunning) {
      intervalId = setInterval(() => {
        dispatch(updateElapsedTime()) // Update the timer every second
      }, 1000)
    }

    // Cleanup interval when component unmounts or timer stops
    return (): void => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRunning, dispatch])

  // Fetch total time spent today when the component mounts
  useEffect(() => {
    window.api.getTotalTimeToday().then((response) => {
      // Dispatch the action to set the time spent today in Redux
      dispatch(setTotalTimeToday(response.data))
    })
  }, [dispatch])

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-3xl font-mono">{formatTime(elapsedTime)}</div>
        <button onClick={handleToggleTimer} className="p-2 hover:bg-gray-100 rounded-full">
          {isRunning ? (
            <StopCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Play className="w-5 h-5 text-green-500" />
          )}
        </button>
      </div>
      <div className="space-y-2">
        <div className="space-y-2">
          <div className="text-sm font-medium">{taskName || 'Select a task to start timer'}</div>
          <div className="text-xs text-gray-500">
            {projectName || 'Select a project to assign task'}
          </div>
        </div>
      </div>
    </div>
  )
}
