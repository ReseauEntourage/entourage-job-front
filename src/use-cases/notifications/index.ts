import { createSlice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { saga } from './notifications.saga';
import { slice } from './notifications.slice';

type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
  saga: Saga;
};

export * from './notifications.selectors';

export const notificationsActions = slice.actions;

export const notificationsConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
