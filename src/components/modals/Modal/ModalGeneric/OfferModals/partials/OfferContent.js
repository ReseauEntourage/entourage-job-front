import PropTypes from 'prop-types';
import React from 'react';
import { OfferInfoContainer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/partials/OfferInfoContainer';
import { Button, Grid, SimpleLink } from 'src/components/utils';
import { BUSINESS_LINES } from 'src/constants';
import { findConstantFromValue, formatParagraph } from 'src/utils';

export const OfferContent = ({ offer }) => {
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
          <div>
            <SimpleLink
              isExternal
              target="_blank"
              href={offer.link.trim()}
              className="uk-link-muted"
            >
              {offer.link.trim()}
            </SimpleLink>
          </div>
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
    businessLines: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    link: PropTypes.string,
  }).isRequired,
};
