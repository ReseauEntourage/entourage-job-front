/* eslint-disable @typescript-eslint/no-explicit-any */
import { Slice, StateFromReducersMapObject } from '@reduxjs/toolkit';

import { Saga } from 'redux-saga';

export type SliceRootState<S extends Slice> = {
  [Key in S['name']]: ReturnType<S['getInitialState']>;
};

export type Selector = (state: any, ...params: any[]) => any;
export type Selectors = Record<string, Selector>;

type Actions = Record<string, (...params: any[]) => any>;

export interface ExtendedSlice {
  slice: Slice;
  actions: Actions;
  saga?: Saga;
  selectors?: Selectors;
}

export type ExtendedSlices = Record<string, ExtendedSlice>;

export type ExtendedSlicesList = ExtendedSlice[];

type ReducersFromSlices<M extends ExtendedSlices> = {
  [Key in keyof M as M[Key]['slice']['name']]: M[Key]['slice']['reducer'];
};

export type InstancesWithSliceName<T extends Record<string, ExtendedSlice>> = {
  [Key in keyof T as T[Key]['slice']['name']]: T[Key];
};

export type StateFromSlices<M extends ExtendedSlices> =
  StateFromReducersMapObject<ReducersFromSlices<M>>;

export type AnyAction = any;

export type OmitFirst<T extends any[]> = T extends [any, ...infer R]
  ? R
  : never;
