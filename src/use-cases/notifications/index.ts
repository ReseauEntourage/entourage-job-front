import { createExtendedSlice } from 'src/store/utils';
import { saga } from './notifications.saga';
import { extraSelectors } from './notifications.selectors';
import { slice } from './notifications.slice';

/**
 * @deprecated
 */
export * from './notifications.selectors';
export const notificationsActions = slice.actions;

export const notifications = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
