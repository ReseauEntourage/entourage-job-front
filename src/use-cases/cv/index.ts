import { createSlice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { saga } from './cv.saga';
import { slice } from './cv.slice';

export type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
  saga: Saga;
};

export type UseCaseConfigType = Record<string, UseCaseConfigItem>;

export * from './cv.selectors';

export const cvActions = slice.actions;

export const cvConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
