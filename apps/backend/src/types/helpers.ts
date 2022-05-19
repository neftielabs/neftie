export type Result<Data, Error = undefined> = Error extends undefined
  ?
      | {
          success: true;
          data: Data;
        }
      | { success: false }
  :
      | {
          success: true;
          data: Data;
        }
      | { success: false; error: Error };

export type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

export type Pagination = {
  cursor: string | null;
  limit: number;
};
