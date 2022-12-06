import React from 'react';
import { Button } from 'src/components/utils';
import PropTypes from 'prop-types';
import { IconNoSSR } from 'src/components/utils/Icon';
import ModalExternalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { openModal } from 'src/components/modals/Modal';
import {
  ButtonContainer,
  Container,
  Title,
  Description,
} from './NoOpportunities.styles';

const NoOpportunities = ({ status }) => {
  return (
    <Container>
      <Title>Vous n&apos;avez aucune offre {status.toLowerCase()}.</Title>
      <Description>
        Vous pouvez chercher des offres qui vous correspondent sur le site
        LinkedOut ou renseigner des offres externes qui vous interessent.
        L’avantage d’ajouter des offres externes, vous permet de centraliser
        toutes vos demarches afin de faciliter le suivi.
      </Description>
      <ButtonContainer>
        <Button
          style="default"
          color="primaryOrange"
          dataTestId="candidat-add-offer"
          onClick={() => {
            openModal(<ModalExternalOffer />);
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
          style="primary"
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
      </ButtonContainer>
    </Container>
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
};

export default NoOpportunities;
