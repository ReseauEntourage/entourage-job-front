import { UseCaseConfigItem } from '../types';
import { saga } from './company.saga';
import { slice } from './company.slice';

export * from './company.selectors';

export const companyActions = slice.actions;

export const companyConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
