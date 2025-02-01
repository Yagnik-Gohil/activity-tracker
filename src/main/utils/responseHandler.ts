// responseHandler.ts

import { ErrorResponse, SuccessResponse } from './interface'

/**
 * Standard success response
 * @param {string} message - The success message
 * @param {T} data - The data returned from the operation (dynamic type)
 * @returns {SuccessResponse<T>} - Formatted response for success
 */
export const successResponse = <T>(message: string, data: T = {} as T): SuccessResponse<T> => {
  return {
    status: 1,
    message,
    data
  }
}

/**
 * Standard error response
 * @param {string} message - The error message
 * @param {T} data - Optional error data (default is an empty object)
 * @returns {ErrorResponse<T>} - Formatted response for error
 */
export const errorResponse = <T>(message: string, data: T = {} as T): ErrorResponse<T> => {
  return {
    status: 0,
    message,
    data
  }
}
