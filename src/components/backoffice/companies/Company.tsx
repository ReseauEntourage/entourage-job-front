import React from 'react';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { useIsDesktop } from '@/src/hooks/utils';
import { HeaderCompany } from '../../headers/HeaderCompany/HeaderCompany';
import { Section } from '../../utils';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import {
  StyledCompanyLeftColumn,
  StyledCompanyRightColumn,
} from './Company.styles';
import { CompanyDescription } from './CompanyParts/CompanyDescription/CompanyDescription';

export const Company = () => {
  const { selectedCompany } = useSelectedCompany();
  const isDesktop = useIsDesktop();

  if (!selectedCompany) return null;

  return (
    <StyledBackofficeBackground>
      <HeaderCompany
        id={selectedCompany.id}
        name={selectedCompany.name}
        logoUrl={selectedCompany.logoUrl}
        isEditable={false}
        businessSectors={selectedCompany.businessSectors}
        department={selectedCompany.department}
      />
      <Section className="custom-page">
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledCompanyLeftColumn className={`${isDesktop ? '' : 'mobile'}`}>
            <CompanyDescription
              description={selectedCompany.description}
              isEditable={false}
            />
          </StyledCompanyLeftColumn>
          <StyledCompanyRightColumn>Right column</StyledCompanyRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
