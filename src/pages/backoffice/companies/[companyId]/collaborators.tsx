import React from 'react';
import { CompanyCollaboratorsList } from '@/src/components/backoffice/companies/CompanyCollaboratorsList';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';

const CompanyCollaboratorsPage = () => {
  const { selectedCompany, isFetchCompanyRequested } = useSelectedCompany();

  return (
    <LayoutBackOffice title="Gestion de vos collaborateurs">
      {selectedCompany && !isFetchCompanyRequested ? (
        <CompanyCollaboratorsList company={selectedCompany} />
      ) : (
        <LoadingScreen />
      )}
    </LayoutBackOffice>
  );
};

export default CompanyCollaboratorsPage;
