import { createExtendedSlice } from 'src/store/utils';
import { saga } from './current-user.saga';
import { extraSelectors } from './current-user.selectors';
import { slice } from './current-user.slice';

/**
 * @deprecated
 */
export * from './current-user.selectors';
export const currentUserActions = slice.actions;

export const currentUser = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
