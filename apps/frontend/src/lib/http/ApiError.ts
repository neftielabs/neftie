import type { ApiErrorResponse } from "@neftie/common";

export class ApiError extends Error implements ApiErrorResponse {
  status?: "error" | "fail" | undefined;

  error?: Error | undefined;

  stack?: string | undefined;

  constructor(data: ApiErrorResponse) {
    super(data.message);
    Object.setPrototypeOf(this, ApiError.prototype);

    this.status = data.status;
    this.error = data.error;
    this.stack = data.stack;
  }
}
