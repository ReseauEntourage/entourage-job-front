import { createSlice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { saga } from './messaging.saga';
import { slice } from './messaging.slice';

export type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
  saga: Saga;
};

export type UseCaseConfigType = Record<string, UseCaseConfigItem>;

export * from './messaging.selectors';

export const messagingActions = slice.actions;

export const messagingConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
