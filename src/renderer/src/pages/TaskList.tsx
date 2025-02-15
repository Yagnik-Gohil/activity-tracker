import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { ChevronDown, ChevronUp, Edit, Trash2, Plus, ChevronRight } from 'lucide-react'
import { TaskFormPopup } from '../components/TaskFormPopup'
import { ITask, TaskStatus } from '@renderer/utils/interface'
import taskAPI from '@renderer/api/taskAPI'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/store/store'
import { startTimer, stopTimer } from '@renderer/store/timerSlice'
// Import your SVGs as paths or URLs
import startIcon from '@renderer/utils/play.svg'
import stopIcon from '@renderer/utils/stop.svg'
import { ConfirmPopup } from '@renderer/components/ConfirmPopup'

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
  const { taskId, isRunning } = useSelector((state: RootState) => state.timer)
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; taskId: number | null }>({
    isOpen: false,
    taskId: null
  })

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
    // If the task is already running, stop the timer
    if (taskId === task.id && isRunning) {
      dispatch(stopTimer())
    } else {
      // If the task is not running or a new task, start the timer
      dispatch(
        startTimer({
          projectId: Number(projectId)!,
          taskId: task.id,
          taskName: task.name,
          projectName: location.state
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
    setConfirmDelete({ isOpen: true, taskId: id })
  }

  const confirmDeletion = async (): Promise<void> => {
    if (confirmDelete.taskId !== null) {
      const result = await taskAPI.deleteTask(confirmDelete.taskId)
      if (result) {
        setTasks(tasks.filter((task) => task.id !== confirmDelete.taskId))
        setExpandedTaskId(null)
      }
    }
    setConfirmDelete({ isOpen: false, taskId: null })
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
            className="flex items-center gap-2 h-10 px-4 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 transition"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search tasks..."
            className="flex-grow h-10 px-3 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="h-10 px-3 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <tr className="border-b border-gray-300">
              <th className="w-8 py-3"></th>
              <th
                className="py-3 pr-4 text-left font-medium text-sm text-gray-800 cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Title
                  {sortKey === 'name' &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    ))}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left font-medium text-sm text-gray-800 w-[120px] cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortKey === 'status' &&
                    (sortOrder === 'asc' ? (
                      <ChevronUp className="ml-1 w-4 h-4" />
                    ) : (
                      <ChevronDown className="ml-1 w-4 h-4" />
                    ))}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left font-medium text-sm text-gray-800 w-[100px] cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center">
                  Created
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
                  className={`border-b border-gray-300 hover:bg-gray-100 cursor-pointer ${expandedTaskId === task.id ? 'bg-gray-100' : ''} group`}
                  onClick={() => toggleTaskExpand(task.id)}
                >
                  <td className="py-3 pl-2">
                    <ChevronRight
                      className={`w-4 h-4 text-gray-500 transition-transform ${expandedTaskId === task.id ? 'rotate-90' : ''}`}
                    />
                  </td>
                  <td className="h-12 py-3 pr-4 flex justify-between items-center space-x-4">
                    <div className="font-medium text-sm text-gray-900">{task.name}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleTimer(task)
                      }}
                      className={`rounded-full transition-all bg-gray-200 hover:bg-gray-300 focus:outline-none border border-gray-900 ${taskId === task.id ? 'block' : 'group-hover:block hidden'}`}
                    >
                      {isRunning && taskId === task.id ? (
                        <img src={stopIcon} alt="Stop Timer" className="w-8 h-8 text-gray-900" />
                      ) : (
                        <img src={startIcon} alt="Start Timer" className="w-8 h-8 text-gray-900" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <select
                      value={task.status}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleStatusChange(task, e.target.value as TaskStatus)
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="px-2 py-1 text-xs font-medium border border-gray-400 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      <option value={TaskStatus.TODO}>Todo</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-700">
                    {task.created_at && new Date(task.created_at).toLocaleDateString()}
                  </td>
                </tr>

                {expandedTaskId === task.id && (
                  <tr className="bg-gray-100">
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
                            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTask(task.id)
                            }}
                            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded"
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

      {/* Confirmation Popup */}
      <ConfirmPopup
        isOpen={confirmDelete.isOpen}
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDeletion}
        onCancel={() => setConfirmDelete({ isOpen: false, taskId: null })}
      />
    </div>
  )
}
