import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TimerWidget } from './TimerWidget'
import { AddProjectPopup } from './AddProjectPopup'

export function Sidebar(): JSX.Element {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [projects, setProjects] = useState([
    { id: 1, name: 'Project A' },
    { id: 2, name: 'Project B' },
    { id: 3, name: 'Project C' }
  ])

  return (
    <div className="w-80 border-r h-full flex flex-col bg-white">
      <div className="p-4 space-y-4">
        <TimerWidget />
        <Link
          to="/dashboard"
          className="flex items-center px-3 py-2 rounded hover:bg-gray-100 transition-colors"
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
      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-2 flex justify-between items-center">
          <h2 className="text-sm font-semibold">Projects</h2>
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
        <div className="overflow-y-auto h-full">
          <div className="space-y-1 p-2">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                {project.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <AddProjectPopup isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} />
    </div>
  )
}
