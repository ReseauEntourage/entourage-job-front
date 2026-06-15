import { UseCaseConfigItem } from '../types';
import { saga } from './wizard.saga';
import { slice } from './wizard.slice';

export * from './wizard.selectors';
export * from './wizard.types';

export const wizardActions = slice.actions;

export const wizardConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
