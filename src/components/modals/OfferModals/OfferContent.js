import { OfferInfoContainer } from 'src/components/modals/OfferModals/OfferInfoContainer';
import { findConstantFromValue, formatParagraph } from 'src/utils';
import { Button, Grid } from 'src/components/utils';
import { BUSINESS_LINES } from 'src/constants';
import React from 'react';
import PropTypes from 'prop-types';

const OfferContent = ({ offer }) => {
  return (
    <Grid gap="medium" childWidths={['1-1']}>
      {offer.companyDescription && (
        <OfferInfoContainer icon="comment" title="Description de l'entreprise">
          <div>{formatParagraph(offer.companyDescription)}</div>
        </OfferInfoContainer>
      )}
      <OfferInfoContainer icon="comment" title="Description de l'offre">
        <div>{formatParagraph(offer.description)}</div>
      </OfferInfoContainer>
      {offer.skills && (
        <OfferInfoContainer icon="check" title="Compétences importantes">
          <div>{formatParagraph(offer.skills)}</div>
        </OfferInfoContainer>
      )}
      {offer.prerequisites && (
        <OfferInfoContainer icon="check" title="Pré-requis">
          <div>{formatParagraph(offer.prerequisites)}</div>
        </OfferInfoContainer>
      )}
      {offer.otherInfo && (
        <OfferInfoContainer icon="more" title="Autres précisions">
          <div>{formatParagraph(offer.otherInfo)}</div>
        </OfferInfoContainer>
      )}
      {offer.link && (
        <OfferInfoContainer icon="link" title="Lien">
          <div>{offer.link.trim()}</div>
        </OfferInfoContainer>
      )}
      {offer.businessLines && (
        <Grid gap="small">
          {offer.businessLines.map(({ name }, index) => {
            return (
              <Button key={index} disabled>
                <span style={{ color: '#666' }}>
                  {findConstantFromValue(name, BUSINESS_LINES).label}
                </span>
              </Button>
            );
          })}
        </Grid>
      )}
    </Grid>
  );
};

OfferContent.propTypes = {
  offer: PropTypes.shape({
    companyDescription: PropTypes.string,
    description: PropTypes.string,
    prerequisites: PropTypes.string,
    otherInfo: PropTypes.string,
    skills: PropTypes.string,
    businessLines: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
  }).isRequired,
};

export default OfferContent;
