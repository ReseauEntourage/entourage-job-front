import { createSlice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';

export type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
  saga: Saga;
};

export type UseCaseConfigType = Record<string, UseCaseConfigItem>;
