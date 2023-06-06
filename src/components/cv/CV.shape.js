import PropTypes from 'prop-types';
import { AMBITIONS_PREFIXES } from 'src/constants/index.ts';

export const CVShape = PropTypes.exact({
  user: PropTypes.shape({
    candidat: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      zone: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  catchphrase: PropTypes.string,
  story: PropTypes.string,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  availability: PropTypes.string,
  urlImg: PropTypes.string,
  contracts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  ambitions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      prefix: PropTypes.oneOf(
        AMBITIONS_PREFIXES.map(({ value }) => {
          return value;
        })
      ),
    })
  ),
  businessLines: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number,
    })
  ).isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number,
    })
  ).isRequired,
  transport: PropTypes.string,
  skills: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number,
    })
  ).isRequired,
  passions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number,
    })
  ).isRequired,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      skills: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          order: PropTypes.number,
        })
      ).isRequired,
    })
  ).isRequired,
  status: PropTypes.string,
  UserId: PropTypes.string,
});
