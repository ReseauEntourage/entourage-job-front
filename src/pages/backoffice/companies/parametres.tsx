import React, { useMemo } from 'react';
import { StyledBackofficeBackground } from '@/src/components/backoffice/Backoffice.styles';
import { HeaderCompany } from '@/src/components/headers/HeaderCompany/HeaderCompany';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';

const CompanyParametresPage = () => {
  const currentUser = useAuthenticatedUser();
  const company = useMemo(() => currentUser?.company, [currentUser.company]);

  if (!company) {
    return null;
  }

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
      </StyledBackofficeBackground>
    </LayoutBackOffice>
  );
};

export default CompanyParametresPage;
