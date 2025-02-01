// src/renderer/utils/toastHelper.ts
import { toast } from 'react-hot-toast'

/**
 * Display a success toast notification.
 * @param message - The message to show in the success toast.
 */
export const showSuccessToast = (message: string): void => {
  toast.success(message)
}

/**
 * Display an error toast notification.
 * @param message - The message to show in the error toast.
 */
export const showErrorToast = (message: string): void => {
  toast.error(message)
}
