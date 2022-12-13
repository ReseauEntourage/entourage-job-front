import Link from 'next/link';
import React from 'react';
import { BUSINESS_LINES } from 'src/constants';
import { findConstantFromValue, buildBusinessLineForSentence } from 'src/utils';
import PropTypes from 'prop-types';

const OpportunitiesList = ({ offers }) => {
  return (
    <div>
      {/* {offers?.map((offer) => {
        return (
          <div>
            <Link href={`/backoffice/candidat/offres/${offer.id}`}>
              <ul>
                <li>Public: {offer.isPublic ? 'oui' : 'non'}</li>
                <li>Dep: {offer.department}</li>
                <li>
                  BL:{' '}
                  {offer.businessLines?.map((BL) => {
                    return buildBusinessLineForSentence(
                      findConstantFromValue(BL.name, BUSINESS_LINES)
                    );
                  })}
                </li>
              </ul>
            </Link>
          </div>
        );
      })} */}
    </div>
  );
};
OpportunitiesList.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
export default OpportunitiesList;
