import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { IProject } from '@renderer/utils/interface'
import projectAPI from '@renderer/api/projectAPI'
import { ConfirmPopup } from '@renderer/components/ConfirmPopup'

export function Settings(): JSX.Element {
  const [projects, setProjects] = useState<IProject[]>([])
  const [editingProject, setEditingProject] = useState<IProject | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; projectId: number | null }>(
    {
      isOpen: false,
      projectId: null
    }
  )

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async (): Promise<void> => {
    const projectsData = await projectAPI.getProjects()
    setProjects(projectsData)
  }

  const handleEditProject = (project: IProject): void => {
    setEditingProject(project)
  }

  const handleSaveProject = async (id: number, newName: string): Promise<void> => {
    const updatedProject = await projectAPI.updateProject(id, newName)
    if (updatedProject) {
      setProjects(projects.map((p) => (p.id === id ? { ...p, name: newName } : p)))
      setEditingProject(null)
    }
  }

  const handleDeleteClick = (id: number): void => {
    setConfirmDelete({ isOpen: true, projectId: id })
  }

  const confirmDeletion = async (): Promise<void> => {
    if (confirmDelete.projectId !== null) {
      const isDeleted = await projectAPI.deleteProject(confirmDelete.projectId)
      if (isDeleted) {
        setProjects(projects.filter((p) => p.id !== confirmDelete.projectId))
        window.location.reload()
      }
    }
    setConfirmDelete({ isOpen: false, projectId: null })
  }

  return (
    <div>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Projects</h3>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300"
            >
              {editingProject?.id === project.id ? (
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="flex-1 px-2 py-1 mr-2 border border-gray-300 rounded focus:outline-none"
                  autoFocus
                />
              ) : (
                <span className="flex-1">{project.name}</span>
              )}
              <div className="flex space-x-2">
                {editingProject?.id === project.id ? (
                  <button
                    onClick={() => handleSaveProject(project.id, editingProject.name)}
                    className="px-3 py-1 text-sm text-white bg-black rounded-md hover:bg-gray-900 transition"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-1 text-gray-600 hover:text-gray-900 transition"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClick(project.id)}
                  className="p-1 text-gray-600 hover:text-gray-900 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Popup */}
      <ConfirmPopup
        isOpen={confirmDelete.isOpen}
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={confirmDeletion}
        onCancel={() => setConfirmDelete({ isOpen: false, projectId: null })}
      />
    </div>
  )
}
