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
import {
  StyledCompanyLeftColumn,
  StyledCompanyRightColumn,
} from '../Company.styles';
import { CompanyDescription } from '../CompanyParts/CompanyDescription/CompanyDescription';

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
              />
            </StyledCompanyLeftColumn>
            <StyledCompanyRightColumn>Right column</StyledCompanyRightColumn>
          </StyledBackofficeGrid>
        </Section>
      </StyledBackofficeBackground>
    </LayoutBackOffice>
  );
};
