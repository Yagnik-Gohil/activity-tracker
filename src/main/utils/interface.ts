/**
 * Type definition for the success response with a generic type for the data.
 */
export interface SuccessResponse<T = unknown> {
  status: 1
  message: string
  data: T
}

/**
 * Type definition for the error response with a generic type for the data.
 */
export interface ErrorResponse<T = unknown> {
  status: 0
  message: string
  data: T
}
