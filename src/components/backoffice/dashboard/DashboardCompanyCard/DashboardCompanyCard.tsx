import React from 'react';
import { Company } from '@/src/api/types';
import { Button, Card, Text } from 'src/components/utils';
import {
  StyledContainer,
  StyledCTAContainer,
  StyledNameAndReferentContainer,
  StyledPictureContainer,
} from './DashboardCompanyCard.styles';

export interface DashboardCompanyCardProps {
  company: Company;
}

export const DashboardCompanyCard = ({
  company,
}: DashboardCompanyCardProps) => {
  const companySettingsUrl = `/backoffice/companies/parametres`;
  const companyViewUrl = `/backoffice/companies/${company.id}`;
  const isCompanyAdmin = true; // TODO : replace with actual logic to determine if the user is a company admin
  const companyAdmin = {
    firstName: 'John',
    lastName: 'Doe',
  }; // TODO: bind with actual admin
  const currentUserIsAdmin = false; // TODO: replace with actual logic to determine if the current user is an admin

  return (
    <Card
      dataTestId="dashboard-profile-card"
      title="Mon entreprise"
      centerTitle
    >
      <StyledContainer>
        <StyledPictureContainer>Image</StyledPictureContainer>
        <StyledNameAndReferentContainer>
          <Text size="large" color="primaryBlue" weight="bold" center>
            {company.name}
          </Text>
          <Text>
            <i>
              {currentUserIsAdmin
                ? `Vous êtes le référent`
                : `Référent : ${companyAdmin.firstName} ${companyAdmin.lastName
                    .charAt(0)
                    .toUpperCase()}`}
            </i>
          </Text>
        </StyledNameAndReferentContainer>
        <StyledCTAContainer>
          {isCompanyAdmin ? (
            <Button variant="secondary" rounded href={companySettingsUrl}>
              Modifier ma page entreprise
            </Button>
          ) : (
            <Button variant="secondary" rounded href={companyViewUrl}>
              Voir ma page entreprise
            </Button>
          )}
        </StyledCTAContainer>
      </StyledContainer>
    </Card>
  );
};
