import { createExtendedSlice } from 'src/store/utils';
import { saga } from './profiles.saga';
import { extraSelectors } from './profiles.selectors';
import { slice } from './profiles.slice';

/**
 * @deprecated
 */
export * from './profiles.selectors';
export const profilesActions = slice.actions;

export const profiles = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
