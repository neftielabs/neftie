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

export type OffsetPaginated<T> = {
  items: T;
  meta?: {
    nextPage?: number;
  };
};
