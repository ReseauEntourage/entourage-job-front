import React from 'react';
import { Section } from 'src/components/utils';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { isRoleIncluded } from 'src/utils';
import { CVPreferencesCard } from './CVPreferencesCard';
import { ChangePasswordCard } from './ChangePasswordCard';
import { HeaderParametres } from './HeaderParametres';
import { ParametresHelpCard } from './ParametresHelpCard';
import {
  StyledParametresGrid,
  StyledParametresLayout,
  StyledParametresLeftColumn,
  StyledParametresRightColumn,
} from './ParametresLayout.styles';
import {
  UserInformationCard,
  LinkedUserInformationCard,
} from './UserInformationCard';

interface ParametresLayoutProps {
  loadingPersonal: boolean;
}

export const ParametresLayout = ({
  loadingPersonal,
}: ParametresLayoutProps) => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();

  return (
    <StyledParametresLayout>
      <HeaderParametres />
      <Section className="custom-page">
        <StyledParametresGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledParametresLeftColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {/* Informations Personnelles */}
            <UserInformationCard
              title="Informations personnelles"
              loadingPersonal={loadingPersonal}
            />
            {/* Préférences du CV */}
            {isRoleIncluded(CANDIDATE_USER_ROLES, user.role) && (
              <CVPreferencesCard />
            )}
            {/* Changement de mot de passe */}
            <ChangePasswordCard />
          </StyledParametresLeftColumn>

          <StyledParametresRightColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {/* LinkedUser info */}
            {isRoleIncluded(
              [
                USER_ROLES.COACH,
                USER_ROLES.CANDIDATE,
                USER_ROLES.CANDIDATE_EXTERNAL,
              ],
              user.role
            ) && (
              <>
                <ParametresHelpCard />
                <LinkedUserInformationCard />
              </>
            )}
          </StyledParametresRightColumn>
        </StyledParametresGrid>
      </Section>
    </StyledParametresLayout>
  );
};
