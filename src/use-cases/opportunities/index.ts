import { createSlice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { saga } from './opportunities.saga';
import { slice } from './opportunities.slice';

export type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
  saga: Saga;
};


export * from './opportunities.selectors';

export const opportunitiesActions = slice.actions;

export const opportunitiesConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
