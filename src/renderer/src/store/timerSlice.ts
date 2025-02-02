import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TimerState {
  isRunning: boolean
  projectId: number | null
  taskId: number | null
  taskName: string | null
  projectName: string | null
  elapsedTime: number // Store the time passed in seconds
}

const initialState: TimerState = {
  isRunning: false,
  projectId: null,
  taskId: null,
  taskName: null,
  projectName: null,
  elapsedTime: 0 // Initialize elapsed time to 0
}

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (
      state,
      action: PayloadAction<{
        projectId: number
        taskId: number
        taskName: string
        projectName: string
      }>
    ) => {
      // Start the timer, but do not reset elapsedTime when starting
      state.isRunning = true
      state.projectId = action.payload.projectId
      state.taskId = action.payload.taskId
      state.taskName = action.payload.taskName
      state.projectName = action.payload.projectName
      // Do not reset elapsedTime here
    },
    stopTimer: (state) => {
      // Stop the timer but preserve task/project info
      state.isRunning = false
      // Do not reset task/project details, keep them intact
    },
    updateElapsedTime: (state) => {
      // Update elapsed time only if the timer is running
      if (state.isRunning) {
        state.elapsedTime += 1 // Increment elapsed time by 1 second when the timer is running
      }
    },
    resetElapsedTime: (state) => {
      // Reset elapsed time manually if needed
      state.elapsedTime = 0
    },
    resetTimer: (state) => {
      // Reset the entire timer (but not task/project details)
      state.isRunning = false
      state.elapsedTime = 0
    },

    // New action to set the total elapsed time from today's data
    setTotalTimeToday: (state, action: PayloadAction<number>) => {
      state.elapsedTime = action.payload // Set the total time spent today in seconds
    }
  }
})

export const {
  startTimer,
  stopTimer,
  updateElapsedTime,
  resetElapsedTime,
  resetTimer,
  setTotalTimeToday
} = timerSlice.actions

export default timerSlice.reducer
export type { TimerState }
