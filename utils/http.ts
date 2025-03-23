// HTTP utility functions and types

import type { AxiosError, AxiosResponse } from 'axios';

// Custom response type that matches our API responses
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: any;
}

// Custom error type that extends AxiosError
export type HTTPError = AxiosError<ApiErrorResponse> & {
  // Add any additional properties if needed
};

export interface HTTPResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
