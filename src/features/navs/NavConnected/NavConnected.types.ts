import type { JSX } from 'react';

export interface NotifBadges {
  messaging: number;
  // Unseen notifications of the bell (rows, not events)
  notifications: number;
  // Admins only: reported targets to handle in their zone
  reports: number;
}

export type NotifBadge = keyof NotifBadges;

export interface NavConnectedItem {
  href: string;
  badge?: NotifBadge;
  icon?: JSX.Element;
  name?: string;
  external?: boolean;
  queryParams?: string;
  onClick?: () => void;
  disabled?: boolean;
  tag?: {
    action;
  };
}

export interface NavConnectedMainItem extends Omit<NavConnectedItem, 'href'> {
  href?: string;
  subMenu?: NavConnectedItem[];
}

export const NavConnectedMainItemDefaultProps: NavConnectedMainItem = {
  badge: undefined,
  icon: undefined,
  external: false,
  tag: undefined,
  queryParams: '',
  subMenu: undefined,
  onClick: undefined,
  disabled: false,
  href: '',
};
