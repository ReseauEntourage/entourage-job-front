import React from 'react';
import { Company } from '@/src/api/types';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { Section } from '@/src/components/ui';
import { HeaderCompany } from '@/src/features/headers/HeaderCompany/HeaderCompany';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../../Backoffice.styles';
import { CompanyCollaboratorsPreviewList } from '../CompanyProfile/CompanyParts/CompanyCollaboratorsPreviewList/CompanyCollaboratorsPreviewList';
import { CompanyDescription } from '../CompanyProfile/CompanyParts/CompanyDescription/CompanyDescription';
import { CompanyLinks } from '../CompanyProfile/CompanyParts/CompanyLinks/CompanyLinks';
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
            <StyledCompanyLeftColumn>
              <CompanyDescription
                description={company.description}
                isEditable
              />
              <CompanyCollaboratorsPreviewList
                companyId={company.id}
                isEditable
              />
            </StyledCompanyLeftColumn>
            <StyledCompanyRightColumn>
              <CompanyLinks
                name={company.name}
                url={company.url}
                hiringUrl={company.hiringUrl}
                linkedInUrl={company.linkedInUrl}
                isEditable
              />
            </StyledCompanyRightColumn>
          </StyledBackofficeGrid>
        </Section>
      </StyledBackofficeBackground>
    </LayoutBackOffice>
  );
};
