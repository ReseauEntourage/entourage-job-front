/* eslint-disable @typescript-eslint/no-explicit-any */

type UnionKeys<T> = T extends any ? keyof T : never;

type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>>
  : never;

export type StrictUnion<T> = StrictUnionHelper<T, T>;

export type AnyToFix = any;
export type AnyCantFix = any;
