import { useState } from 'react'
import { Edit2, Trash2 } from 'lucide-react'

interface Project {
  id: number
  name: string
}

export function Settings(): JSX.Element {
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Project A' },
    { id: 2, name: 'Project B' },
    { id: 3, name: 'Project C' }
  ])
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const handleEditProject = (project: Project): void => {
    setEditingProject(project)
  }

  const handleSaveProject = (id: number, newName: string): void => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, name: newName } : p)))
    setEditingProject(null)
  }

  const handleDeleteProject = (id: number): void => {
    setProjects(projects.filter((p) => p.id !== id))
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
