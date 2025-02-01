import { useState } from 'react'
import projectAPI from '@renderer/api/projectAPI'
import { showErrorToast } from '@renderer/utils/toastHelper'

interface AddProjectPopupProps {
  isOpen: boolean
  onClose: () => void
  onProjectAdded: () => void // Callback to refresh projects
}

export function AddProjectPopup({
  isOpen,
  onClose,
  onProjectAdded
}: AddProjectPopupProps): JSX.Element | null {
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleAddProject = async (): Promise<void> => {
    if (!projectName.trim()) {
      showErrorToast('Project name cannot be empty')
      return
    }

    setLoading(true)
    await projectAPI.createProject(projectName)
    setProjectName('')
    onProjectAdded() // Refresh project list
    onClose()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">Add New Project</h2>
        <input
          type="text"
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddProject}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Project'}
          </button>
        </div>
      </div>
    </div>
  )
}
