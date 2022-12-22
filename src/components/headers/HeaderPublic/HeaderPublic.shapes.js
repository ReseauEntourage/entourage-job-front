import PropTypes from 'prop-types';

export const HeaderPublicItemShape = PropTypes.shape({
  href: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tag: PropTypes.shape({
    action: PropTypes.string,
  }).isRequired,
});
