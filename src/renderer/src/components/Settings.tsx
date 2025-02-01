import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import { IProject } from '@renderer/utils/interface'
import projectAPI from '@renderer/api/projectAPI'

export function Settings(): JSX.Element {
  const [projects, setProjects] = useState<IProject[]>([])
  const [editingProject, setEditingProject] = useState<IProject | null>(null)

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

  const handleDeleteProject = async (id: number): Promise<void> => {
    const isDeleted = await projectAPI.deleteProject(id)
    if (isDeleted) {
      setProjects(projects.filter((p) => p.id !== id))
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Projects</h3>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg shadow"
            >
              {editingProject?.id === project.id ? (
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="flex-1 px-2 py-1 mr-2 border rounded"
                  autoFocus
                />
              ) : (
                <span className="flex-1">{project.name}</span>
              )}
              <div className="flex space-x-2">
                {editingProject?.id === project.id ? (
                  <button
                    onClick={() => handleSaveProject(project.id, editingProject.name)}
                    className="px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditProject(project)}
                    className="p-1 text-gray-600 hover:text-blue-600"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
