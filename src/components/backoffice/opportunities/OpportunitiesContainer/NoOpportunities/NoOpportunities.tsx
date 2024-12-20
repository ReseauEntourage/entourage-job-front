import React from 'react';
import {
  formatPlural,
  tabs,
  TabsLabelsType,
} from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.utils';
import { openModal } from 'src/components/modals/Modal';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { Button } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';

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

export const NoOpportunities = ({
  status = tabs[0].text,
  fetchOpportunities,
}: NoOpportunitiesProps) => {
  const candidateId = useCandidateId();
  return (
    <StyledContainer>
      <StyledTitle>
        Vous n&apos;avez aucune{' '}
        {formatPlural((status as string).toLowerCase(), 0)}.
      </StyledTitle>
      <StyledDescription>
        Vous pouvez chercher des offres qui vous correspondent sur le site
        Entourage Pro ou renseigner des offres externes qui vous interessent.
        Centraliser toutes vos candidatures en facilite le suivi.
      </StyledDescription>
      <StyledButtonContainer>
        <Button
          style="custom-primary-inverted"
          color="primaryBlue"
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
          <LucidIcon name="Plus" />
          Ajouter une offre externe
        </Button>
        <Button
          style="custom-primary"
          dataTestId="candidat-find-offer"
          href={`/backoffice/candidat/${candidateId}/offres/public`}
          shallow
        >
          <LucidIcon name="Search" />
          Trouver des offres Entourage Pro
        </Button>
      </StyledButtonContainer>
    </StyledContainer>
  );
};
