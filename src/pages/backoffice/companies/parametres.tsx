import React from 'react';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen/LoadingScreen';
import { CompanyParameters } from '@/src/features/backoffice/companies/CompanyParameters/CompanyParameters';
import { useCurrentUserCompany } from '@/src/hooks/current-user/useCurrentUserCompany';

const CompanyParametresPage = () => {
  const company = useCurrentUserCompany();

  if (!company) {
    return <LoadingScreen />;
  }

  return <CompanyParameters company={company} />;
};

export default CompanyParametresPage;
