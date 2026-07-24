interface ErrorResponse {
  data?: {
    message?: string;
  };
  message?: string;
}

export function getErrorMessage(error: unknown, defaultMessage: string = 'An unexpected error occurred'): string {
  const typedError = error as ErrorResponse;
  
  if (typedError.data?.message) {
    return typedError.data.message;
  }
  
  if (typedError.message) {
    return typedError.message;
  }
  
  return defaultMessage;
}
