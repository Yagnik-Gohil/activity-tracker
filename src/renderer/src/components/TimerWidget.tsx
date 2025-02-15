import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store'
import { startTimer, stopTimer, updateElapsedTime, setTimerState } from '@renderer/store/timerSlice'
import { showErrorToast, showSuccessToast } from '@renderer/utils/toastHelper'
import startIcon from '@renderer/utils/play.svg'
import stopIcon from '@renderer/utils/stop.svg'

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

  // Fetch timer state from Electron main process on load
  useEffect(() => {
    const fetchTimerState = async (): Promise<void> => {
      const response = await window.api.getTimerState()
      dispatch(setTimerState(response))
    }
    fetchTimerState()
  }, [dispatch])

  // Handle start/stop of the timer
  const handleToggleTimer = (): void => {
    if (!taskId || !projectId) {
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

  useEffect(() => {
    // When the timer starts or stops, call the API to update the backend
    if (taskId) {
      showSuccessToast(isRunning ? 'Timer Started' : 'Timer Stopped')
      window.api.updateTimerState({
        isRunning, // true when the timer starts, false when it stops
        taskId, // ID of the task
        projectId: Number(projectId), // ID of the project
        taskName,
        projectName
      })
    }
  }, [isRunning, taskId, projectId]) // This will re-trigger the effect when the timer state changes

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

  return (
    <div className="bg-gray-50 p-6 rounded-lg border flex flex-col items-center justify-center space-y-4">
      <div className="w-full text-center">
        <div className="text-xl font-bold bg-gray-900 text-white px-4 py-2 rounded-md">
          {formatTime(elapsedTime)}
        </div>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handleToggleTimer}
          className="rounded-full transition-all bg-gray-200 hover:bg-gray-300 focus:outline-none border border-gray-900"
        >
          {isRunning ? (
            <img src={stopIcon} alt="Stop Timer" className="w-12 h-12 text-gray-900" />
          ) : (
            <img src={startIcon} alt="Start Timer" className="w-12 h-12 text-gray-900" />
          )}
        </button>
      </div>
      <div className="space-y-2 text-center">
        <div className="text-sm font-medium text-gray-900">
          {taskName || 'Select a task to start timer'}
        </div>
        <div className="text-xs text-gray-500">
          {projectName || 'Select a project to assign task'}
        </div>
      </div>
    </div>
  )
}
