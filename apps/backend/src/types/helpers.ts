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
