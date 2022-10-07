import PropTypes from 'prop-types';

export const HeaderSubItemShape = PropTypes.shape({
  href: PropTypes.string.isRequired,
  badge: PropTypes.string,
  icon: PropTypes.string,
  name: PropTypes.string.isRequired,
  external: PropTypes.bool,
  queryParams: PropTypes.string,
  tag: PropTypes.shape({
    action: PropTypes.string,
  }),
});

export const HeaderSubItemDefaultProps = {
  badge: '',
  icon: '',
  external: false,
  tag: null,
  queryParams: '',
};

export const NotifBadgesShape = PropTypes.shape({
  cv: PropTypes.number.isRequired,
  members: PropTypes.number.isRequired,
  note: PropTypes.number.isRequired,
  offers: PropTypes.number.isRequired,
});
