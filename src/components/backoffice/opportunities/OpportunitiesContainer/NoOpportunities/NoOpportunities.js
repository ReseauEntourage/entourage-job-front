import React from 'react';
import { Button } from 'src/components/utils';
import PropTypes from 'prop-types';
import { IconNoSSR } from 'src/components/utils/Icon';
import ModalExternalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { openModal } from 'src/components/modals/Modal';
import {
  StyledButtonContainer,
  StyledContainer,
  StyledDescription,
  StyledTitle,
} from './NoOpportunities.styles';

const NoOpportunities = ({ status, fetchOpportunities }) => {
  return (
    <StyledContainer>
      <StyledTitle>
        Vous n&apos;avez aucune offre {status.toLowerCase()}.
      </StyledTitle>
      <StyledDescription>
        Vous pouvez chercher des offres qui vous correspondent sur le site
        LinkedOut ou renseigner des offres externes qui vous interessent.
        L’avantage d’ajouter des offres externes, vous permet de centraliser
        toutes vos demarches afin de faciliter le suivi.
      </StyledDescription>
      <StyledButtonContainer>
        <Button
          style="custom-primary-inverted"
          color="primaryOrange"
          dataTestId="candidat-add-offer"
          onClick={() => {
            openModal(
              <ModalExternalOffer fetchOpportunities={fetchOpportunities} />
            );
          }}
        >
          <IconNoSSR
            name="plus"
            ratio="0.8"
            className="uk-margin-small-right"
          />
          Ajouter une offre externe
        </Button>
        <Button
          style="custom-primary"
          dataTestId="candidat-find-offer"
          href="/backoffice/candidat/offres?tag=public"
          shallow
        >
          <IconNoSSR
            name="search"
            ratio="0.8"
            className="uk-margin-small-right"
          />
          Trouver des offres LinkedOut
        </Button>
      </StyledButtonContainer>
    </StyledContainer>
  );
};

NoOpportunities.propTypes = {
  status: PropTypes.oneOf([
    'à traiter',
    'consultée',
    "en phase d'entretien",
    'abandonnée',
    'acceptées',
  ]).isRequired,
  fetchOpportunities: PropTypes.func.isRequired,
};

export default NoOpportunities;
