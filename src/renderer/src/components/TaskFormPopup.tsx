import React, { useState, useEffect } from 'react'
import { ITask, TaskStatus } from '@renderer/utils/interface'
import { CustomSelect } from './Select'

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">{task ? 'Edit Task' : 'Create Task'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none h-32"
              rows={4}
            />
          </div>

          {!task && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <CustomSelect
                value={status}
                onChange={setStatus}
                options={[
                  { label: 'Todo', value: TaskStatus.TODO },
                  { label: 'In Progress', value: TaskStatus.IN_PROGRESS },
                  { label: 'Completed', value: TaskStatus.COMPLETED }
                ]}
                className="w-full"
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900 transition disabled:opacity-50"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
