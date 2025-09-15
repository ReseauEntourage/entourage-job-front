import React from 'react';
import { useSelector } from 'react-redux';
import { LoadingScreen } from '@/src/components/backoffice/LoadingScreen';
import { Company } from '@/src/components/backoffice/companies/Company';
import { useSelectedCompany } from '@/src/hooks/useSelectedCompany';
import { fetchSelectedCompanySelectors } from '@/src/use-cases/company';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';

const CompanyViewPage = () => {
  const { selectedCompany } = useSelectedCompany();
  const isFetchCompanyRequested = useSelector(
    fetchSelectedCompanySelectors.selectIsFetchSelectedCompanyRequested
  );

  return (
    <LayoutBackOffice title={selectedCompany ? selectedCompany.name : ''}>
      {selectedCompany && !isFetchCompanyRequested ? (
        <Company />
      ) : (
        <LoadingScreen />
      )}
    </LayoutBackOffice>
  );
};

export default CompanyViewPage;
