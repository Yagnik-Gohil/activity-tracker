import { useEffect } from 'react'

interface ConfirmPopupProps {
  isOpen: boolean
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmPopup({
  isOpen,
  title = 'Confirm',
  message,
  onConfirm,
  onCancel
}: ConfirmPopupProps): JSX.Element | null {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onCancel()
      if (event.key === 'Enter') onConfirm()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }

    return (): void => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onConfirm, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg border border-gray-300">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-900 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
