import { saga } from './authentication.saga';
import { slice } from './authentication.slice';

export * from './authentication.selectors';

export const authenticationActions = slice.actions;

export const authenticationConfig = {
  slice,
  saga,
};
