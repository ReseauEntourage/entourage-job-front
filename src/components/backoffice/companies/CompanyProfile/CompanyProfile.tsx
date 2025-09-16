import React from 'react';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { useIsDesktop } from '@/src/hooks/utils';
import { HeaderCompany } from '../../../headers/HeaderCompany/HeaderCompany';
import { Section } from '../../../utils';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../../Backoffice.styles';
import { CompanyCollaboratorsPreviewList } from './CompanyParts/CompanyCollaboratorsPreviewList/CompanyCollaboratorsPreviewList';
import { CompanyDescription } from './CompanyParts/CompanyDescription/CompanyDescription';
import {
  StyledCompanyLeftColumn,
  StyledCompanyRightColumn,
} from './CompanyProfile.styles';

export const CompanyProfile = () => {
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
            {selectedCompany.description && (
              <CompanyDescription
                description={selectedCompany.description}
                isEditable={false}
              />
            )}
            <CompanyCollaboratorsPreviewList companyId={selectedCompany.id} />
          </StyledCompanyLeftColumn>
          <StyledCompanyRightColumn>Right column</StyledCompanyRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
