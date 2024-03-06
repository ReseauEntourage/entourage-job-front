/* eslint-disable @typescript-eslint/no-explicit-any */

export type UnionKeys<T> = T extends any ? keyof T : never;

type StrictUnionHelper<T, TAll> = T extends any
  ? T & Partial<Record<Exclude<UnionKeys<TAll>, keyof T>, never>>
  : never;

export type StrictUnion<T> = StrictUnionHelper<T, T>;

export type AnyToFix = any;
export type AnyCantFix = any;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type MakeAllPropertiesOptional<T> = {
  [P in keyof T]?: T[P];
};

export type FlattenUnionToOptionalIntersection<T> = MakeAllPropertiesOptional<
  UnionToIntersection<T>
>;

export type Unarray<T> = T extends (infer U)[] ? U : T;
