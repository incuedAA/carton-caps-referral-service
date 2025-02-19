export interface ErrorResponse {
  message: string;
}

export const createErrorResponse = (message: string): ErrorResponse => ({
  message,
});
