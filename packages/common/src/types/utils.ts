export interface ApiErrorResponse {
  status?: "error" | "fail";
  error?: Error;
  message?: string;
  stack?: string;
}

export type Paginated<T> = {
  items: T;
  meta?: {
    cursor?: string;
  };
};
