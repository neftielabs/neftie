import { ifElse } from "fp-ts-std/Function";

import * as A from "fp-ts/Array";
import * as P from "fp-ts/Predicate";
import * as R from "fp-ts/Record";
import * as S from "fp-ts/string";

//
// Logic
//

export const isFalse: P.Predicate<boolean> = (v) => v === false;

export const isTrue = P.not(isFalse);

export const isTruthy = (v: any) => !!v;

export const ifTrue = <F, S>(f: F, s: S) =>
  ifElse<boolean, F | S>(() => f)(() => s)(isTrue);

export const onlyTrue = <F>(f: F) => ifTrue(f, undefined);

export const everyTrue = A.every(isTrue);
export const someTrue = A.some(isTrue);

export const isEmpty = (v: any) =>
  someTrue([A.isEmpty(v), R.isEmpty(v), S.isEmpty(v)]);

export const notNull: P.Predicate<string> = (v) =>
  v !== undefined && v !== null;

//
// Misc
//

export const noop = () => {};
