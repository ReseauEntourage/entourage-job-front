import { UseCaseConfigItem } from '../types';
import './profiles.listeners';
import { slice } from './profiles.slice';

export * from './profiles.selectors';
export * from './profiles.api';

export const profilesActions = slice.actions;

export const profilesConfig = {
  slice,
} as UseCaseConfigItem;
