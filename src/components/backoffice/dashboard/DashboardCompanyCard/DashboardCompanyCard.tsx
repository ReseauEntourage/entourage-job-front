import React from 'react';
import { Company } from '@/src/api/types';
import { CompanyInviteCollaboratorsModal } from '@/src/components/modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal';
import { openModal } from '@/src/components/modals/Modal';
import { Button, Card, ImgCompanyProfile, Text } from 'src/components/utils';
import {
  StyledContainer,
  StyledCTAContainer,
  StyledPictureContainer,
} from './DashboardCompanyCard.styles';

export interface DashboardCompanyCardProps {
  company: Company;
}

export const DashboardCompanyCard = ({
  company,
}: DashboardCompanyCardProps) => {
  const companySettingsUrl = `/`; // TODO : replace with actual company settings URL

  const openCompanySendInviteModal = () => {
    openModal(<CompanyInviteCollaboratorsModal companyId={company.id} />);
  };
  return (
    <Card
      dataTestId="dashboard-profile-card"
      title="Mon entreprise"
      centerTitle
    >
      <StyledContainer>
        <StyledPictureContainer>
          <ImgCompanyProfile company={company} size={110} highlight />
        </StyledPictureContainer>
        <Text size="large" color="primaryBlue" weight="bold" center>
          {company.name}
        </Text>
        <StyledCTAContainer>
          <Button variant="secondary" rounded href={companySettingsUrl}>
            Modifier
          </Button>

          {/* Before implementing the next step invite collaborators */}
          <Button
            variant="secondary"
            rounded
            onClick={openCompanySendInviteModal}
          >
            Inviter des collaborateurs
          </Button>
        </StyledCTAContainer>
      </StyledContainer>
    </Card>
  );
};
