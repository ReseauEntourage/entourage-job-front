import { UseCaseConfigItem } from '../types';
import './company.listeners';
import { slice } from './company.slice';

export * from './company.selectors';
export * from './company.api';

export const companyActions = slice.actions;

export const companyConfig = {
  slice,
} as UseCaseConfigItem;
