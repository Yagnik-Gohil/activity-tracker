import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TimerState {
  isRunning: boolean
  projectId: string | null
  taskId: string | null
  taskName: string | null
  projectName: string | null
  elapsedTime: number // Add elapsedTime here to store the time passed in seconds
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
        projectId: string
        taskId: string
        taskName: string
        projectName: string
      }>
    ) => {
      // Start the timer
      state.isRunning = true
      state.projectId = action.payload.projectId
      state.taskId = action.payload.taskId
      state.taskName = action.payload.taskName
      state.projectName = action.payload.projectName
      state.elapsedTime = 0 // Reset elapsed time when starting a new timer
    },
    stopTimer: (state) => {
      // Stop the timer but preserve task/project info
      state.isRunning = false
      // Do not reset task/project details, keep them intact
      // Only reset elapsedTime when stopping the timer
      state.elapsedTime = 0
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
    // Optional: Reset only the timer details (not the task/project)
    resetTimer: (state) => {
      state.isRunning = false
      state.elapsedTime = 0
    }
  }
})

export const { startTimer, stopTimer, updateElapsedTime, resetElapsedTime, resetTimer } =
  timerSlice.actions

export default timerSlice.reducer
export type { TimerState }
