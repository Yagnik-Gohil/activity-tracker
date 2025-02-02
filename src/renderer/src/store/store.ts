import { configureStore } from '@reduxjs/toolkit'
import timerReducer, { TimerState } from './timerSlice'

export const store = configureStore<{
  timer: TimerState
}>({
  reducer: {
    timer: timerReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
