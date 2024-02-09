import { createSlice } from '@reduxjs/toolkit';
import { slice } from './notifications.slice';
import { Saga } from 'redux-saga';
import { saga } from './notifications.saga';

export type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
  saga: Saga;
};

export type UseCaseConfigType = Record<string, UseCaseConfigItem>;

export * from './notifications.selectors';

export const notificationsActions = slice.actions;

export const notificationsConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
