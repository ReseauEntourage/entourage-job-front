import { createSlice } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { authenticationConfig } from './authentication';

type UseCaseConfig = Record<
  string,
  {
    slice: ReturnType<typeof createSlice>;
    saga?: Saga;
  }
>;

export const useCasesConfig: UseCaseConfig = {
  authenticationConfig,
};
