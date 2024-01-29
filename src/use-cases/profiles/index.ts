import { createSlice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { saga } from './profiles.saga';
import { slice } from './profiles.slice';

export type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
  saga: Saga;
};

export type UseCaseConfigType = Record<string, UseCaseConfigItem>;

export * from './profiles.selectors';

export const profilesActions = slice.actions;

export const profilesConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
