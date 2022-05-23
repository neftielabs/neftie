type ResultSuccess<D> = D extends undefined
  ? {
      success: true;
    }
  : {
      success: true;
      data: D;
    };

export type ResultError<E> = E extends undefined
  ? {
      success: false;
    }
  : { success: false; error: E };

export type Result<Data = undefined, Error = undefined> =
  | ResultSuccess<Data>
  | ResultError<Error>;

export type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

export type Pagination = {
  cursor: string | null;
  limit: number;
};
