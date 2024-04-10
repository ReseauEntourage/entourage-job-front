import { UseCaseConfigItem } from '../types';
import { saga } from './opportunities.saga';
import { slice } from './opportunities.slice';

export * from './opportunities.selectors';

export const opportunitiesActions = slice.actions;

export const opportunitiesConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
