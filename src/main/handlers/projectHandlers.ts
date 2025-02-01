import { ipcMain } from 'electron'
import {
  addProject,
  getProjects,
  updateProjectDuration,
  deleteProject
} from '../service/projectService'
import { successResponse, errorResponse } from '../utils/responseHandler'

/**
 * Handles the creation of a new project.
 */
export const createProjectHandler = (): void => {
  ipcMain.handle('create-project', async (_, name: string) => {
    try {
      const newProject = await addProject(name)
      return successResponse('Project created successfully', newProject)
    } catch (error) {
      console.error('❌ Error creating project:', error)
      return errorResponse('Failed to create project')
    }
  })
}

/**
 * Handles fetching all projects with tasks.
 */
export const getProjectsHandler = (): void => {
  ipcMain.handle('get-projects', async () => {
    try {
      const projects = await getProjects()
      return successResponse('Projects fetched successfully', projects)
    } catch (error) {
      console.error('❌ Error fetching projects:', error)
      return errorResponse('Failed to fetch projects')
    }
  })
}

/**
 * Handles updating project duration.
 */
export const updateProjectDurationHandler = (): void => {
  ipcMain.handle('update-project-duration', async (_, projectId: number, newDuration: number) => {
    try {
      const updatedProject = await updateProjectDuration(projectId, newDuration)
      return successResponse('Project duration updated successfully', updatedProject)
    } catch (error) {
      console.error('❌ Error updating project duration:', error)
      return errorResponse('Failed to update project duration')
    }
  })
}

/**
 * Handles deleting a project.
 */
export const deleteProjectHandler = (): void => {
  ipcMain.handle('delete-project', async (_, projectId: number) => {
    try {
      const result = await deleteProject(projectId)
      if (result) {
        return successResponse('Project deleted successfully')
      }
      return errorResponse('Project not found or failed to delete')
    } catch (error) {
      console.error('❌ Error deleting project:', error)
      return errorResponse('Failed to delete project')
    }
  })
}
