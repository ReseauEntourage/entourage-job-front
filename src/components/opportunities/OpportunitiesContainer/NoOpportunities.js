import React from 'react';
import { Button, Section } from 'src/components/utils';
import PropTypes from 'prop-types';
import { IconNoSSR } from 'src/components/utils/Icon';
import ModalExternalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { openModal } from 'src/components/modals/Modal';

const NoOpportunities = ({ status }) => {
  return (
    <Section className="uk-width-1-1">
      <div className=" uk-text-center uk-flex uk-flex-center">
        <div className="uk-width-xlarge">
          <h2 className="uk-margin-remove">
            Vous n&apos;avez aucune offre {status.toLowerCase()}
          </h2>
          <p>
            Vous pouvez chercher des offres qui vous correspondent sur le site
            LinkedOut ou renseigner des offres externes qui vous interessent.
            L’avantage d’ajouter des offres externes, vous permet de centraliser
            toutes vos demarches afin de faciliter le suivi
          </p>
          <Button
            style="custom-secondary"
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
            Ajouter une offre externe à LinkedOut
          </Button>
          <Button
            style="primary"
            dataTestId="candidat-find-offer"
            href="/backoffice/candidat/offres?isPublic[]=true"
          >
            <IconNoSSR
              name="plus"
              ratio="0.8"
              className="uk-margin-small-right"
            />
            Trouver des offres LinkedOut
          </Button>
        </div>
      </div>
    </Section>
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
