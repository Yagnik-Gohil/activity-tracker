// responseHandler.ts

import { ErrorResponse, SuccessResponse } from './interface'

/**
 * Standard success response
 * @param {string} message - The success message
 * @param {any} data - The data returned from the operation
 * @returns {SuccessResponse} - Formatted response for success
 */
export const successResponse = (message: string, data: unknown = {}): SuccessResponse => {
  return {
    status: 1,
    message,
    data
  }
}

/**
 * Standard error response
 * @param {string} message - The error message
 * @param {any} data - Optional error data (default is an empty object)
 * @returns {ErrorResponse} - Formatted response for error
 */
export const errorResponse = (message: string, data: unknown = {}): ErrorResponse => {
  return {
    status: 0,
    message,
    data
  }
}
