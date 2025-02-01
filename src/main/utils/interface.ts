/**
 * Type definition for the success response
 */
export interface SuccessResponse {
  status: 1
  message: string
  data: unknown
}

/**
 * Type definition for the error response
 */
export interface ErrorResponse {
  status: 0
  message: string
  data: unknown
}
