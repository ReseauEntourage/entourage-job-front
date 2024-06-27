import { createExtendedSlice } from 'src/store/utils';
import { saga } from './authentication.saga';
import { extraSelectors } from './authentication.selectors';
import { slice } from './authentication.slice';

/**
 * @deprecated
 */
export * from './authentication.selectors';
export const authenticationActions = slice.actions;

export const authentication = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
