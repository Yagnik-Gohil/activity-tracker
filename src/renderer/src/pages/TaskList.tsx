import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, ChevronRight } from 'lucide-react'

type Status = 'Todo' | 'In Progress' | 'Completed'
type SortKey = 'title' | 'created' | 'status'

interface Task {
  id: number
  title: string
  description: string
  created: string
  status: Status
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Redesign the home page',
    description:
      'Our current home page looks dated and should be redesigned. We need to improve the user experience and make it more modern. This includes updating the color scheme, typography, and overall layout to better reflect our brand identity.',
    created: '2023-08-20',
    status: 'In Progress'
  },
  {
    id: 2,
    title: 'Update pricing page',
    description:
      'Add new pricing tiers and update design. Need to include monthly and annual pricing options, highlight the most popular plan, and add comparison features.',
    created: '2023-08-19',
    status: 'Todo'
  },
  {
    id: 3,
    title: 'Implement user authentication',
    description:
      'Set up secure login and registration system. This includes implementing OAuth, email verification, password reset functionality, and ensuring all security best practices are followed.',
    created: '2023-08-18',
    status: 'Completed'
  }
]

export function TaskList(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [sortKey, setSortKey] = useState<SortKey>('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)

  const handleSort = (key: SortKey): void => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedTasks = tasks
    .filter(
      (task) =>
        (statusFilter === 'All' || task.status === statusFilter) &&
        (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleEdit = (id: number): void => {
    // Implement edit functionality
    console.log('Edit task', id)
  }

  const handleDelete = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id))
    setExpandedTaskId(null)
  }

  const toggleTaskExpand = (id: number): void => {
    setExpandedTaskId(expandedTaskId === id ? null : id)
  }

  useEffect(() => {
    // Here you would typically fetch tasks for the specific project
    console.log(`Fetching tasks for project ${projectId}`)
    // For now, we'll just log the project ID
  }, [projectId])

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Tasks for Project {projectId}</h1>
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
          >
            <option value="All">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-thin">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="w-8 py-3"></th>
              <th
                className="py-3 pr-4 text-left font-medium text-sm"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center cursor-pointer">
                  Title{' '}
                  {sortKey === 'title' &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    ))}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left font-medium text-sm w-[120px]"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center cursor-pointer whitespace-nowrap">
                  Status{' '}
                  {sortKey === 'status' &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    ))}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left font-medium text-sm w-[100px]"
                onClick={() => handleSort('created')}
              >
                <div className="flex items-center cursor-pointer whitespace-nowrap">
                  Created{' '}
                  {sortKey === 'created' &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTasks.map((task) => (
              <React.Fragment key={task.id}>
                <tr
                  className={`border-b hover:bg-gray-50 cursor-pointer ${expandedTaskId === task.id ? 'bg-gray-50' : ''}`}
                  onClick={() => toggleTaskExpand(task.id)}
                >
                  <td className="py-3 pl-2">
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{task.title}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        task.status === 'Todo'
                          ? 'bg-yellow-100 text-yellow-700'
                          : task.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">{task.created}</td>
                </tr>
                {expandedTaskId === task.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="px-10 py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-8">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Description</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {task.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(task.id)
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(task.id)
                            }}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
