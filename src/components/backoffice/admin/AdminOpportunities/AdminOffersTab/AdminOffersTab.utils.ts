import { ADMIN_OFFERS_TAGS } from "src/constants";

export const adminTabs = ADMIN_OFFERS_TAGS;


export const adminTabsLabels = adminTabs.map(({ label }) => {
    return label;
  });
  
export type TabsLabelsType = (typeof adminTabsLabels)[keyof typeof adminTabsLabels];

export const adminTabsValue = adminTabs.map(({ value }) => {
return value;
});
