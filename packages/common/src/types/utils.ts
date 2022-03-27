export interface ApiErrorResponse {
  status?: "error" | "fail";
  error?: Error;
  message?: string;
  stack?: string;
}
