import { UseCaseConfigItem } from '../types';
import './recruitement-alerts.listeners';
import { slice } from './recruitement-alerts.slice';

export * from './recruitement-alerts.slice';
export * from './recruitement-alerts.selectors';
export * from './recruitement-alerts.api';

export const recruitementAlertsConfig = {
  slice,
} as UseCaseConfigItem;
