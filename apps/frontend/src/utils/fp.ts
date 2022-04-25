import { ifElse } from "fp-ts-std/Function";
import { every } from "fp-ts/Array";
import { Predicate } from "fp-ts/Predicate";

export const isTrue: Predicate<boolean> = (v) => !!v;

export const ifTrue = <F, S>(f: F, s: S) =>
  ifElse<boolean, F | S>(() => f)(() => s)(isTrue);

export const onlyTrue = <F>(f: F) => ifTrue(f, undefined);

export const everyTrue = every(isTrue);
