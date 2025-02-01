import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { Project } from './entities/Project'
import { Task } from './entities/Task'
import { Activity } from './entities/Activity'

// Function to ensure database directory exists
function ensureDBDirectory(): string {
  const dbDir = path.join(app.getPath('userData'), 'database')
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }
  return path.join(dbDir, 'activity-tracker.sqlite')
}

// Get the database path
const databasePath = ensureDBDirectory()

// Initialize TypeORM Data Source
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  entities: [Project, Task, Activity],
  synchronize: true,
  logging: false
})

// Function to initialize the database connection
export async function initializeDB(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      console.log('📦 Database connected successfully at:', databasePath)
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
}
