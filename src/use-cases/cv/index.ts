import { createExtendedSlice } from 'src/store/utils';
import { saga } from './cv.saga';
import { extraSelectors } from './cv.selectors';
import { slice } from './cv.slice';

/**
 * @deprecated
 */
export * from './cv.selectors';
export const cvActions = slice.actions;

export const cv = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
