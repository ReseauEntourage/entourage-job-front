import React from 'react';
import { CheckListElement, List } from '@/src/components/ui/Lists';
import { COLORS } from '@/src/constants/styles';
import { useElearning } from '@/src/features/backoffice/elearning/useElearning';
import { Button, Card, LucidIcon, Text } from 'src/components/ui';
import { ProgressBar } from 'src/components/ui/ProgressBar/ProgressBar';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserCompany } from 'src/hooks/current-user/useCurrentUserCompany';
import {
  StyledElearningNudge,
  StyledElearningNudgeContent,
  StyledElearningNudgeFooter,
  StyledElearningNudgeIconCircle,
} from './DashboardElearningNudge.styles';

const BENEFITS_BY_ROLE: Record<
  UserRoles.COACH | UserRoles.CANDIDATE,
  string[]
> = {
  [UserRoles.COACH]: [
    'Découvrir comment agir sur Entourage Pro',
    'Comprendre vos rôles et missions',
    'Avoir la bonne posture vis-à-vis des candidats',
  ],
  [UserRoles.CANDIDATE]: [
    'Découvrir comment agir sur Entourage Pro',
    'Comprendre comment les coachs peuvent vous soutenir',
    'Apprendre à bien communiquer avec les coachs',
  ],
};

export const DashboardElearningNudge = () => {
  const user = useAuthenticatedUser();
  const company = useCurrentUserCompany();
  const { completionRate, nbUnitsCompleted, nbUnitsTotal } = useElearning();

  const isCompanyAdmin = Boolean(company && company.companyUser?.isAdmin);
  const isEligibleRole =
    user.role === UserRoles.CANDIDATE || user.role === UserRoles.COACH;

  if (!isEligibleRole || isCompanyAdmin || user.elearningCompletedAt) {
    return null;
  }

  const benefits = BENEFITS_BY_ROLE[user.role];
  const isCandidate = user.role === UserRoles.CANDIDATE;
  const title = `Finalisez la formation pour contacter et être contacté par des ${
    isCandidate ? 'coachs' : 'candidats'
  }`;

  return (
    <Card>
      <StyledElearningNudge>
        <StyledElearningNudgeIconCircle>
          <LucidIcon
            name="GraduationCap"
            size={28}
            color={COLORS.primaryBlue}
          />
        </StyledElearningNudgeIconCircle>
        <StyledElearningNudgeContent>
          <Text size="large" weight="semibold">
            {title}
          </Text>
          <Text color="darkGray">
            Ce que vous allez apprendre avec la formation
          </Text>
          <List>
            {benefits.map((benefit) => (
              <CheckListElement key={benefit}>
                <Text>{benefit}</Text>
              </CheckListElement>
            ))}
          </List>
          <StyledElearningNudgeFooter>
            {completionRate > 0 && (
              <>
                <Text color="darkGray" size="small">
                  {nbUnitsTotal - nbUnitsCompleted} module
                  {nbUnitsTotal - nbUnitsCompleted > 1 ? 's' : ''} restant
                  {nbUnitsTotal - nbUnitsCompleted > 1 ? 's' : ''}
                </Text>
                <ProgressBar value={completionRate} color="primaryBlue" />
              </>
            )}
            <Button href="/backoffice/ressources/formations">
              {completionRate === 0
                ? 'Commencer ma formation'
                : 'Continuer ma formation'}
            </Button>
          </StyledElearningNudgeFooter>
        </StyledElearningNudgeContent>
      </StyledElearningNudge>
    </Card>
  );
};
