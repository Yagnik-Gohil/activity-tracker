import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom' // Import useLocation
import { TimerWidget } from './TimerWidget'
import { AddProjectPopup } from './AddProjectPopup'
import projectAPI from '@renderer/api/projectAPI'
import { IProject } from '@renderer/utils/interface'

export function Sidebar(): JSX.Element {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [projects, setProjects] = useState<IProject[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation() // Access current location

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      const projectList = await projectAPI.getProjects()
      setProjects(projectList)
      setLoading(false)
    }

    fetchProjects()
  }, [])

  // Callback for adding a new project
  const handleProjectAdded = async (): Promise<void> => {
    const updatedProjects = await projectAPI.getProjects()
    setProjects(updatedProjects)
  }

  // Function to check if the current path matches the project link
  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  return (
    <div className="w-80 xl:w-96 border-r h-full flex flex-col bg-white">
      <div className="p-4 space-y-4">
        <TimerWidget />
        <Link
          to="/"
          className={`flex items-center px-3 py-2 rounded transition-colors ${
            isActive('/') ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-100'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </Link>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-2 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-900">Projects</h2>
          <button
            onClick={() => setIsAddProjectOpen(true)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto h-full scrollbar-thin">
          <div className="space-y-1 p-2">
            {loading ? (
              <p className="text-gray-500 text-sm px-3">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-gray-500 text-sm px-3">No projects found</p>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  state={project.name}
                  className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                    isActive(`/project/${project.id}`)
                      ? 'bg-gray-100 text-gray-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {project.name}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <AddProjectPopup
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onProjectAdded={handleProjectAdded} // Refresh projects after adding
      />
    </div>
  )
}
