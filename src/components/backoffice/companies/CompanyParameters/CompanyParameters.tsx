import React from 'react';
import { Company } from '@/src/api/types';
import { HeaderCompany } from '@/src/components/headers/HeaderCompany/HeaderCompany';
import { Section } from '@/src/components/utils';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../../Backoffice.styles';
import { LayoutBackOffice } from '../../LayoutBackOffice';
import { CompanyCollaboratorsPreviewList } from '../CompanyProfile/CompanyParts/CompanyCollaboratorsPreviewList/CompanyCollaboratorsPreviewList';
import { CompanyDescription } from '../CompanyProfile/CompanyParts/CompanyDescription/CompanyDescription';
import {
  StyledCompanyLeftColumn,
  StyledCompanyRightColumn,
} from '../CompanyProfile/CompanyProfile.styles';

export interface CompanyParametersProps {
  company: Company;
}

export const CompanyParameters = ({ company }: CompanyParametersProps) => {
  const isDesktop = useIsDesktop();
  return (
    <LayoutBackOffice title="Mon entreprise">
      <StyledBackofficeBackground>
        <HeaderCompany
          id={company.id}
          name={company.name}
          logoUrl={company.logoUrl}
          businessSectors={company.businessSectors}
          department={company.department}
          isEditable
        />
        <Section className="custom-page">
          <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
            <StyledCompanyLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
              <CompanyDescription
                description={company.description}
                isEditable
                smallCard
              />
              <CompanyCollaboratorsPreviewList
                companyId={company.id}
                isEditable
              />
            </StyledCompanyLeftColumn>
            <StyledCompanyRightColumn>Right column</StyledCompanyRightColumn>
          </StyledBackofficeGrid>
        </Section>
      </StyledBackofficeBackground>
    </LayoutBackOffice>
  );
};
