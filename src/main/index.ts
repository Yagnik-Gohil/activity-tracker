import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initializeDB } from './db/connection'

// Import handlers
import './handlers/projectHandlers'
import './handlers/taskHandlers'
import './handlers/dashboardHandlers'
import { addOrUpdateActivity } from './service/activityService'
import { resetProjectDurationForToday } from './service/projectService'

let mainWindow: BrowserWindow | null = null
let timerInterval: NodeJS.Timeout | null = null // Interval reference

// Timer state object (mutated instead of reassigning)
const currentTimerState = {
  taskId: null as number | null,
  projectId: null as number | null,
  isRunning: false,
  elapsedTime: 0 // Time in seconds
}

/**
 * Cron job that updates activity every 10 minutes.
 */
const startCronJob = (): void => {
  setInterval(async () => {
    if (currentTimerState.isRunning && currentTimerState.taskId && currentTimerState.projectId) {
      await addOrUpdateActivity(
        currentTimerState.taskId,
        currentTimerState.projectId,
        currentTimerState.elapsedTime
      )

      // Reset elapsed time after saving
      currentTimerState.elapsedTime = 0
    }
  }, 600000) // 10 minutes
}

/**
 * Starts incrementing elapsed time every second.
 */
const startElapsedTimeCounter = (): void => {
  if (timerInterval) return // Prevent multiple intervals

  timerInterval = setInterval(() => {
    if (currentTimerState.isRunning) {
      currentTimerState.elapsedTime += 1
      console.log(`⏳ Elapsed time: ${currentTimerState.elapsedTime} seconds`)
    }
  }, 1000) // Increment every second
}

/**
 * Clears the interval to stop counting elapsed time.
 */
const stopElapsedTimeCounter = (): void => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

/**
 * Starts the timer for a specific task and project.
 */
const startTimer = (taskId: number, projectId: number): void => {
  currentTimerState.taskId = taskId
  currentTimerState.projectId = projectId
  currentTimerState.isRunning = true
  currentTimerState.elapsedTime = 0

  startElapsedTimeCounter()

  console.log(`⏳ Timer started for task ${taskId}, project ${projectId}`)
}

/**
 * Stops the current timer and saves elapsed time.
 */
const stopTimer = async (): Promise<void> => {
  if (!currentTimerState.isRunning || !currentTimerState.taskId || !currentTimerState.projectId)
    return

  // Save the elapsed time before stopping the timer
  await addOrUpdateActivity(
    currentTimerState.taskId,
    currentTimerState.projectId,
    currentTimerState.elapsedTime
  )

  currentTimerState.isRunning = false
  stopElapsedTimeCounter()

  console.log(`⏹ Timer stopped for task ${currentTimerState.taskId}`)
}

/**
 * Creates the main application window.
 */
async function createWindow(): Promise<void> {
  if (mainWindow) return // Prevent multiple windows

  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 1080,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.once('ready-to-show', () => mainWindow?.show())

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  const rendererUrl = process.env['ELECTRON_RENDERER_URL']

  if (is.dev && rendererUrl) {
    await mainWindow.loadURL(rendererUrl)
  } else {
    await mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => (mainWindow = null))
}

/**
 * Initializes the application.
 */
app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  try {
    await initializeDB()
    console.log('✅ Database initialized successfully')
    await resetProjectDurationForToday()
    startCronJob() // Start activity tracking
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  stopTimer()
  setTimeout(() => {
    app.quit()
  }, 5000)
})

ipcMain.handle('timer-state-changed', async (_, newState) => {
  const { isRunning, taskId, projectId } = newState

  if (isRunning) {
    console.log('✅ Starting timer...')
    await stopTimer() // Ensure that we stop any running timer first
    startTimer(taskId, projectId) // Start the new timer
  } else {
    console.log('⏹ Stopping timer...')
    await stopTimer() // Stop the current timer if it's running
  }
})
