import React from 'react';
import { Company } from '@/src/api/types';
import { Button, Card, ImgCompanyProfile, Text } from 'src/components/utils';
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
  const isCompanyAdmin = company.companyUser?.isAdmin;
  const companyAdmin = company.admin;

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
        <div>
          <Text size="large" color="primaryBlue" weight="bold" center>
            {company.name}
          </Text>
          {companyAdmin && (
            <StyledNameAndReferentContainer>
              <Text center>
                {isCompanyAdmin
                  ? `Vous êtes le référent`
                  : `Référent : ${
                      companyAdmin.firstName
                    } ${companyAdmin.lastName.charAt(0).toUpperCase()}`}
              </Text>
            </StyledNameAndReferentContainer>
          )}
        </div>

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
