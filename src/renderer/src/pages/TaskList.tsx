import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  StopCircle,
  Play
} from 'lucide-react'
import { TaskFormPopup } from '../components/TaskFormPopup'
import { ITask, TaskStatus } from '@renderer/utils/interface'
import taskAPI from '@renderer/api/taskAPI'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store'
import { startTimer, stopTimer } from '@renderer/store/timerSlice'

type SortKey = 'name' | 'created_at' | 'status'

export function TaskList(): JSX.Element {
  const location = useLocation()
  const dispatch = useDispatch()
  const { projectId } = useParams<{ projectId: string }>()

  const [tasks, setTasks] = useState<ITask[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)
  const [editingTask, setEditingTask] = useState<ITask | null>(null)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null)
  const activeTask = useSelector((state: RootState) => state.timer.taskId)

  useEffect(() => {
    // Fetch tasks from API for the current project
    if (projectId) {
      taskAPI
        .getTasks(parseInt(projectId))
        .then((data) => setTasks(data))
        .catch((err) => console.error('Failed to fetch tasks:', err))
    }
  }, [projectId])

  const handleToggleTimer = (task: ITask): void => {
    if (activeTask === task.id.toString()) {
      dispatch(stopTimer())
    } else {
      dispatch(
        startTimer({
          projectId: projectId!,
          taskId: task.id.toString(),
          taskName: task.name,
          projectName: location.state || 'Unknown Project'
        })
      )
    }
  }

  const handleSort = (key: SortKey): void => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesStatus = !statusFilter || task.status === statusFilter // This checks for empty string too
      const matchesSearch =
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesStatus && matchesSearch
    })
    .sort((a, b) => {
      const getValue = (task: ITask, key: SortKey): string => task[key] || '' // return an empty string if value is undefined

      const valueA = getValue(a, sortKey)
      const valueB = getValue(b, sortKey)

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleAddTask = (): void => {
    setEditingTask(null)
    setIsTaskFormOpen(true)
  }

  const handleEditTask = (task: ITask): void => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  const handleDeleteTask = (id: number): void => {
    taskAPI
      .deleteTask(id)
      .then((result) => {
        if (result) {
          setTasks(tasks.filter((task) => task.id !== id))
          setExpandedTaskId(null)
        }
      })
      .catch((err) => console.error('Failed to delete task:', err))
  }

  const handleSaveTask = (taskData: Omit<ITask, 'id' | 'created_at'>): void => {
    if (editingTask) {
      taskAPI
        .updateTask(editingTask.id, taskData.name, taskData.description, taskData.status)
        .then((updatedTask) => {
          setTasks(tasks.map((task) => (task.id === editingTask.id ? updatedTask : task)))
          setIsTaskFormOpen(false)
        })
        .catch((err) => console.error('Failed to update task:', err))
    } else {
      if (projectId) {
        taskAPI
          .createTask(parseInt(projectId), taskData.name, taskData.description, taskData.status)
          .then((newTask) => {
            setTasks([...tasks, newTask])
            setIsTaskFormOpen(false)
          })
          .catch((err) => console.error('Failed to create task:', err))
      }
    }
  }

  const toggleTaskExpand = (id: number): void => {
    setExpandedTaskId(expandedTaskId === id ? null : id)
  }

  const handleStatusChange = (task: ITask, newStatus: TaskStatus): void => {
    taskAPI
      .updateTask(task.id, task.name, task.description, newStatus)
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((prevTask) => (prevTask.id === task.id ? updatedTask : prevTask))
        )
      })
      .catch((err) => console.error('Failed to update task status:', err))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Tasks for {location.state}</h1>
          <button
            onClick={handleAddTask}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
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
            onChange={(e) => setStatusFilter(e.target.value)} // Keep it as string
          >
            <option value="">All Status</option>
            <option value={TaskStatus.TODO}>Todo</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
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
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center cursor-pointer">
                  Title{' '}
                  {sortKey === 'name' &&
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
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center cursor-pointer whitespace-nowrap">
                  Created{' '}
                  {sortKey === 'created_at' &&
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
                  onMouseEnter={() => setHoveredTaskId(task.id)}
                  onMouseLeave={() => setHoveredTaskId(null)}
                >
                  <td className="py-3 pl-2">
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
                    />
                  </td>
                  <td className="h-12 py-3 pr-4 flex justify-between items-center space-x-4">
                    <div className="font-medium text-sm">{task.name}</div>

                    {(hoveredTaskId === task.id || activeTask === task.id.toString()) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleTimer(task)
                        }}
                        className="p-2 rounded-full transition-all bg-gray-100 hover:bg-gray-200 focus:outline-none"
                      >
                        {activeTask === task.id.toString() ? (
                          <StopCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Play className="w-5 h-5 text-green-500" />
                        )}
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleStatusChange(task, e.target.value as TaskStatus)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        task.status === TaskStatus.TODO
                          ? 'bg-yellow-100 text-yellow-700 focus:ring-yellow-500'
                          : task.status === TaskStatus.IN_PROGRESS
                            ? 'bg-blue-100 text-blue-700 focus:ring-blue-500'
                            : 'bg-green-100 text-green-700 focus:ring-green-500'
                      }`}
                    >
                      <option value={TaskStatus.TODO}>Todo</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                    {task.created_at && new Date(task.created_at).toLocaleDateString()}
                  </td>
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
                              handleEditTask(task)
                            }}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTask(task.id)
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

      {isTaskFormOpen && (
        <TaskFormPopup
          isOpen={isTaskFormOpen}
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setIsTaskFormOpen(false)}
        />
      )}
    </div>
  )
}
