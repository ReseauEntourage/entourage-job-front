import { createSlice } from '@reduxjs/toolkit';

export type UseCaseConfigItem = {
  slice: ReturnType<typeof createSlice>;
};

export type UseCaseConfigType = Record<string, UseCaseConfigItem>;
