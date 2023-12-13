import { ADMIN_OFFERS_TAGS } from 'src/constants';

export const adminTabsLabels = ADMIN_OFFERS_TAGS.map(({ label }) => {
  return label;
});

export type TabsLabelsType =
  (typeof adminTabsLabels)[keyof typeof adminTabsLabels];

export const adminTabsValue = ADMIN_OFFERS_TAGS.map(({ value }) => {
  return value;
});
