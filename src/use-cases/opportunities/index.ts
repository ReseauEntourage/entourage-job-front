import { createExtendedSlice } from 'src/store/utils';
import { saga } from './opportunities.saga';
import { extraSelectors } from './opportunities.selectors';
import { slice } from './opportunities.slice';

/**
 * @deprecated
 */
export * from './opportunities.selectors';
export const opportunitiesActions = slice.actions;

export const opportunities = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
