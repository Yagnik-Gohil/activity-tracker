import { IProject } from '@renderer/utils/interface'
import { showSuccessToast, showErrorToast } from '@renderer/utils/toastHelper'

const projectAPI = {
  // Get all projects
  getProjects: async (): Promise<IProject[]> => {
    try {
      const response = await window.api.getProjects()

      return response.data
    } catch (error) {
      console.error('Error fetching projects:', error)

      // Show error toast
      showErrorToast('Failed to fetch projects')
      throw new Error('Failed to fetch projects')
    }
  },

  // Create a new project
  createProject: async (name: string): Promise<IProject> => {
    try {
      const response = await window.api.createProject(name)

      // Show success toast
      showSuccessToast(response.message || 'Project created successfully!')

      return response.data
    } catch (error) {
      console.error('Error creating project:', error)

      // Show error toast
      showErrorToast('Failed to create project')
      throw new Error('Failed to create project')
    }
  },

  // Update a project
  updateProject: async (id: number, name: string): Promise<IProject> => {
    try {
      const response = await window.api.updateProject(id, name)

      // Show success toast
      showSuccessToast(response.message || 'Project updated successfully!')

      return response.data
    } catch (error) {
      console.error('Error updating project:', error)

      // Show error toast
      showErrorToast('Failed to update project')
      throw new Error('Failed to update project')
    }
  },

  // Delete a project
  deleteProject: async (id: number): Promise<boolean> => {
    try {
      const response = await window.api.deleteProject(id)

      // Show success toast
      showSuccessToast(response.message || 'Project deleted successfully!')

      return response.data
    } catch (error) {
      console.error('Error deleting project:', error)

      // Show error toast
      showErrorToast('Failed to delete project')
      throw new Error('Failed to delete project')
    }
  }
}

export default projectAPI
