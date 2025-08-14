import { UseCaseConfigItem } from '../types';
import { saga } from './recruitement-alerts.saga';
import { slice } from './recruitement-alerts.slice';

export * from './recruitement-alerts.slice';
export * from './recruitement-alerts.selectors';

export const recruitementAlertsConfig = {
  slice,
  saga,
} as UseCaseConfigItem;
