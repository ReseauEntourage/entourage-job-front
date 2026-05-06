import React, { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { Card } from '@/src/components/ui/Cards/Card/Card';
import { CompanyGoal } from '@/src/constants/company';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from 'src/hooks/current-user/useCurrentUserCompany';
import { stepsByContext } from './DashboardNextSteps.config';
import { StyledStepsContainer } from './DashboardNextSteps.styles';
import { Context } from './DashboardNextSteps.types';
import { Step } from './Step/Step';

export const DashboardNextSteps = () => {
  const currentUser = useAuthenticatedUser();
  const company = useCurrentUserCompany();
  const currentUserIsCompanyAdmin = company?.companyUser?.isAdmin || false;

  const context = useMemo(() => {
    if (!currentUser) {
      return null;
    }
    if (
      currentUser.role === UserRoles.COACH &&
      currentUserIsCompanyAdmin &&
      company?.goal === CompanyGoal.RECRUIT
    ) {
      return Context.COMPANY_ADMIN_RECRUITMENT_MODE;
    }
    if (currentUser.role === UserRoles.COACH && currentUserIsCompanyAdmin) {
      return Context.COMPANY_ADMIN_TBS_MODE;
    }
    if (currentUser.role === UserRoles.CANDIDATE) {
      return Context.CANDIDATE;
    }
    if (currentUser.role === UserRoles.COACH) {
      return Context.COACH;
    }
    return null;
  }, [currentUser, currentUserIsCompanyAdmin, company?.goal]);

  if (!currentUser || !currentUser.role) {
    return null;
  }

  if (!context) {
    return null;
  }

  const steps = stepsByContext[context] || [];

  return (
    <Card title="Pour aller plus loin" centerTitle>
      <StyledStepsContainer>
        {steps.map((step) => {
          const uuidValue = uuid();
          return <Step step={step} key={uuidValue} />;
        })}
      </StyledStepsContainer>
    </Card>
  );
};
