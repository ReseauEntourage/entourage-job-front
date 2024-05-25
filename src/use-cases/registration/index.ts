import { createExtendedSlice } from 'src/store/utils';
import { saga } from './registration.saga';
import { extraSelectors } from './registration.selectors';
import { slice } from './registration.slice';

/**
 * @deprecated
 */
export * from './registration.selectors';
export const registrationActions = slice.actions;

export const registration = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
