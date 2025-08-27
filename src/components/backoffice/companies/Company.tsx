import React from 'react';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { HeaderCompany } from '../../headers/HeaderCompany/HeaderCompany';
import { StyledBackofficeBackground } from '../Backoffice.styles';

export const Company = () => {
  const { selectedCompany } = useSelectedCompany();

  if (!selectedCompany) return null;

  return (
    <StyledBackofficeBackground>
      <HeaderCompany
        id={selectedCompany.id}
        name={selectedCompany.name}
        logoUrl={selectedCompany.logoUrl}
        isEditable={false}
        businessSectors={[
          {
            name: 'Commerce et distribution',
            prefixes: "l',la",
          },
        ]}
        department={selectedCompany.department}
      />
    </StyledBackofficeBackground>
  );
};
