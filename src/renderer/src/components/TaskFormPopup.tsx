import React, { useState, useEffect } from 'react'
import { ITask, TaskStatus } from '@renderer/utils/interface'

interface TaskFormPopupProps {
  isOpen: boolean
  task: ITask | null
  onSave: (taskData: Omit<ITask, 'id' | 'created_at'>) => void
  onClose: () => void
}

export function TaskFormPopup({
  isOpen,
  task,
  onSave,
  onClose
}: TaskFormPopupProps): JSX.Element | null {
  const [name, setName] = useState(task?.name || '')
  const [description, setDescription] = useState(task?.description || '')
  const [status, setStatus] = useState<TaskStatus>(task?.status || TaskStatus.TODO) // Default to 'TODO'

  useEffect(() => {
    if (task) {
      setName(task.name)
      setDescription(task.description)
      setStatus(task.status)
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    onSave({ name, description, status }) // Send the data on save
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>
        {/* Form submission should be handled here */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              rows={4}
            />
          </div>
          {!task && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={TaskStatus.TODO}>Todo</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.COMPLETED}>Completed</option>
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit" // The button will now trigger the form submission
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
