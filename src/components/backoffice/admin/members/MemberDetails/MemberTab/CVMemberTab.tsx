import React from 'react';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { CVEditPage } from 'src/components/backoffice/cv/CVEditPage';
import { ErrorMessage } from 'src/components/backoffice/cv/ErrorMessage';
import { Section } from 'src/components/utils';
import { OverlayLoader } from 'src/components/utils/OverlayLoader';
import { useFetchCV } from 'src/hooks/useFetchCV';
import { StyledMemberTabLoaderContainer } from './MemberTab.styles';

interface CVMemberTabProps {
  candidateId: string;
}
export function CVMemberTab({ candidateId }: CVMemberTabProps) {
  const { cv, setCV, error, loading } = useFetchCV(candidateId);

  if (loading) {
    return (
      <StyledMemberTabLoaderContainer>
        <OverlayLoader />
      </StyledMemberTabLoaderContainer>
    );
  }

  if (error) {
    return (
      <LayoutBackOffice title="Erreur - Gestion des membres">
        <Section className="uk-text-center" size="large">
          <ErrorMessage error={error} />
        </Section>
      </LayoutBackOffice>
    );
  }

  return <CVEditPage candidateId={candidateId} cv={cv} setCV={setCV} />;
}
