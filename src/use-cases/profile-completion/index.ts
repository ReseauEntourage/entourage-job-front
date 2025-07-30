import { UseCaseConfigItem } from '../types';
import { saga } from './profile-completion.saga';
import { slice } from './profile-completion.slice';

export * from './profile-completion.selectors';

export const profileCompletionActions = slice.actions;

export const profileCompletionConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
