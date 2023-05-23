import PropTypes from 'prop-types';

export interface HeaderConnectedItemType {
  href: string;
  badge?: string;
  icon?: string;
  name?: string;
  external?: boolean;
  queryParams?: string;
  onClick?: () => void;
  disabled?: boolean;
  tag?: {
    action;
  };
}

export interface HeaderConnectedMainItemType extends HeaderConnectedItemType {
  subMenu?: HeaderConnectedItemType[];
}

export const HeaderConnectedMainItemDefaultProps = {
  badge: '',
  icon: '',
  external: false,
  tag: null,
  queryParams: '',
  subMenu: null,
  onClick: () => {
    // do nothing.
  },
  disabled: false,
};

export const NotifBadgesShape = PropTypes.shape({
  cv: PropTypes.number.isRequired,
  members: PropTypes.number.isRequired,
  note: PropTypes.number.isRequired,
  offers: PropTypes.number.isRequired,
});
