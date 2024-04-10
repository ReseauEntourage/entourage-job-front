import { UseCaseConfigItem } from '../types';
import { saga } from './cv.saga';
import { slice } from './cv.slice';

export * from './cv.selectors';

export const cvActions = slice.actions;

export const cvConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
