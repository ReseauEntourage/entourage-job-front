import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { Card } from 'src/components/utils/Cards/Card/Card';
import { UserRoles } from 'src/constants/users';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { stepsByContext } from './DashboardNextSteps.config';
import { StyledStepsContainer } from './DashboardNextSteps.styles';
import { Context } from './DashboardNextSteps.types';
import { Step } from './Step/Step';

export const DashboardNextSteps = () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentUserIsCompanyAdmin =
    currentUser?.company?.companyUser?.isAdmin || false;

  const context = useMemo(() => {
    if (!currentUser) return null;
    if (currentUser.role === UserRoles.COACH && currentUserIsCompanyAdmin) {
      return Context.COMPANY_ADMIN_TBS_MODE;
    }
    // Todo: Handle context for company admin in recruitment mode
    // if (
    //   currentUser.role === UserRoles.COACH &&
    //   currentUserIsCompanyAdmin && CONDITION IS RECRUITMENT MODE
    // ) {
    //   return Context.COMPANY_ADMIN_RECRUITMENT_MODE;
    // }
    if (currentUser.role === UserRoles.CANDIDATE) return Context.CANDIDATE;
    if (currentUser.role === UserRoles.COACH) return Context.COACH;
    return null;
  }, [currentUser, currentUserIsCompanyAdmin]);

  if (!currentUser || !currentUser.role) {
    return null;
  }

  // Return null if context is not defined
  if (!context) {
    return null;
  }

  // Get steps based on the current context
  const steps = stepsByContext[context] || [];

  return (
    <Card title="Les prochaines étapes" centerTitle>
      <StyledStepsContainer>
        {steps.map((step) => {
          const uuidValue = uuid();
          return <Step step={step} key={uuidValue} />;
        })}
      </StyledStepsContainer>
    </Card>
  );
};
