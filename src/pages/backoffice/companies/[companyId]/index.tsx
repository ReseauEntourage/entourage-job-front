import React from 'react';
import { useSelector } from 'react-redux';
import { LayoutBackOffice } from '@/src/components/layouts/LayoutBackOffice';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { CompanyProfile } from '@/src/features/backoffice/companies/CompanyProfile/CompanyProfile';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { fetchSelectedCompanySelectors } from '@/src/use-cases/company';

const CompanyViewPage = () => {
  const { selectedCompany } = useSelectedCompany();
  const isFetchCompanyRequested = useSelector(
    fetchSelectedCompanySelectors.selectIsFetchSelectedCompanyRequested
  );

  return (
    <LayoutBackOffice title={selectedCompany ? selectedCompany.name : ''}>
      {selectedCompany && !isFetchCompanyRequested ? (
        <CompanyProfile />
      ) : (
        <LoadingScreen />
      )}
    </LayoutBackOffice>
  );
};

export default CompanyViewPage;
