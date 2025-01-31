import type { JSX } from 'react';

export interface NotifBadges {
  cv: number;
  note: number;
  offers: number;
  members: number;
  messaging: number;
}

export type NotifBadge = keyof NotifBadges;

export interface HeaderConnectedItem {
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

export interface HeaderConnectedMainItem extends HeaderConnectedItem {
  subMenu?: HeaderConnectedItem[];
}

export const HeaderConnectedMainItemDefaultProps: HeaderConnectedMainItem = {
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
