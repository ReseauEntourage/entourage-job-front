import PropTypes from 'prop-types';

export const MemberPropTypes = PropTypes.shape({
  id: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  lastConnection: PropTypes.string,
  role: PropTypes.string,
  zone: PropTypes.string,
  organization: PropTypes.shape({
    name: PropTypes.string,
  }),
});
