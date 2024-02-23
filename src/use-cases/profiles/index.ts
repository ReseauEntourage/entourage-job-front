import { UseCaseConfigItem } from '../types';
import { saga } from './profiles.saga';
import { slice } from './profiles.slice';

export * from './profiles.selectors';

export const profilesActions = slice.actions;

export const profilesConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
