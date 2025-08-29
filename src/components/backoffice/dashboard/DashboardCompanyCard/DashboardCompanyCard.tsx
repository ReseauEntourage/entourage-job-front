import React from 'react';
import { Company } from '@/src/api/types';
import { Button, Card, Text } from 'src/components/utils';
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
  const companySettingsUrl = `/compagnies/settings`;

  return (
    <Card
      dataTestId="dashboard-profile-card"
      title="Mon entreprise"
      centerTitle
    >
      <StyledContainer>
        <StyledPictureContainer>Image</StyledPictureContainer>
        <Text size="large" color="primaryBlue" weight="bold" center>
          {company.name}
        </Text>
        <StyledCTAContainer>
          <Button variant="secondary" rounded href={companySettingsUrl}>
            Modifier
          </Button>
        </StyledCTAContainer>
      </StyledContainer>
    </Card>
  );
};
