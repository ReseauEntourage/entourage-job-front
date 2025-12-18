import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { CompanyCollaboratorsList } from '@/src/components/backoffice/companies/CompanyCollaboratorsList/CompanyCollaboratorsList';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { companyActions } from '@/src/use-cases/company';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';

const CompanyCollaboratorsPage = () => {
  const dispatch = useDispatch();
  const {
    companyId,
    selectedCompanyWithCollaborators,
    isFetchCompanyWithCollaboratorsRequested,
  } = useSelectedCompany();

  useEffect(() => {
    if (!companyId) {
      return;
    }
    dispatch(companyActions.fetchSelectedCompanyWithCollaboratorsRequested());
  }, [dispatch, companyId]);

  return (
    <LayoutBackOffice title="Gestion de vos collaborateurs">
      {!isFetchCompanyWithCollaboratorsRequested &&
      selectedCompanyWithCollaborators ? (
        <CompanyCollaboratorsList
          companyWithCollaborators={selectedCompanyWithCollaborators}
        />
      ) : (
        <LoadingScreen />
      )}
    </LayoutBackOffice>
  );
};

export default CompanyCollaboratorsPage;
