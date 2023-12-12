import { createSlice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { saga } from './authentication.saga';
import { slice } from './authentication.slice';

export type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
  saga: Saga;
};

export type UseCaseConfigType = Record<string, UseCaseConfigItem>;

export * from './authentication.selectors';

export const authenticationActions = slice.actions;

export const authenticationConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
