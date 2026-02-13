import { UseCaseConfigItem } from '../types';
import { saga } from './events.saga';
import { slice } from './events.slice';
import { updateUserParticipationThunk } from './events.thunks';

export * from './events.selectors';
export { updateUserParticipationThunk };

export const eventsActions = slice.actions;

export const eventsConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
