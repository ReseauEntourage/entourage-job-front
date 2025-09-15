import React, { useMemo } from 'react';
import { CompanyParameters } from '@/src/components/backoffice/companies/company-parameters/CompanyParameters';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';

const CompanyParametresPage = () => {
  const currentUser = useAuthenticatedUser();
  const company = useMemo(() => currentUser?.company, [currentUser.company]);

  if (!company) {
    return null;
  }

  return <CompanyParameters company={company} />;
};

export default CompanyParametresPage;
