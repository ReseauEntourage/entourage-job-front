import PropTypes from 'prop-types';
import React from 'react';
import {
  formatPlural,
  tabs,
  TabsLabelsType,
} from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.utils';
import { useCandidateId } from 'src/components/backoffice/opportunities/useCandidateId';
import { openModal } from 'src/components/modals/Modal';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { Button } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import {
  StyledButtonContainer,
  StyledContainer,
  StyledDescription,
  StyledTitle,
} from './NoOpportunities.styles';

interface NoOpportunitiesProps {
  status: TabsLabelsType;
  fetchOpportunities: () => void;
}

export const NoOpportunities = ({ status = tabs[0].text, fetchOpportunities }:NoOpportunitiesProps) => {
  const candidateId = useCandidateId();
  return (
    <StyledContainer>
      <StyledTitle>
        Vous n&apos;avez aucune {formatPlural((status as string).toLowerCase(), 0)}.
      </StyledTitle>
      <StyledDescription>
        Vous pouvez chercher des offres qui vous correspondent sur le site
        LinkedOut ou renseigner des offres externes qui vous interessent.
        Centraliser toutes vos candidatures en facilite le suivi.
      </StyledDescription>
      <StyledButtonContainer>
        <Button
          style="custom-primary-inverted"
          color="primaryOrange"
          dataTestId="candidat-add-offer"
          onClick={() => {
            openModal(
              <ModalExternalOffer
                fetchOpportunities={fetchOpportunities}
                candidateId={candidateId}
              />
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
          href={`/backoffice/candidat/${candidateId}/offres/public`}
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
