export interface HeaderConnectedItemProps {
  href: string;
  badge?: string;
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

export interface HeaderConnectedMainItemProps extends HeaderConnectedItemProps {
  subMenu?: HeaderConnectedItemProps[];
}

export const HeaderConnectedMainItemDefaultProps = {
  badge: '',
  icon: null,
  external: false,
  tag: null,
  queryParams: '',
  subMenu: null,
  onClick: null,
  disabled: false,
  href: '',
};

export interface NotifBadgesProps {
  cv: number;
  note: number;
  offers: number;
}
