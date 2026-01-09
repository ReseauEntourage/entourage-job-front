import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { CompanyCollaboratorsList } from '@/src/features/backoffice/companies/CompanyCollaboratorsList/CompanyCollaboratorsList';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { companyActions } from '@/src/use-cases/company';

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
