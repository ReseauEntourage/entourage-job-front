import React from 'react';
import {
  StyledProfileLayout,
  StyledProfileGrid,
} from '../../Backoffice.styles';
import { useConfirmationToaster } from '../useConfirmationToaster';
import { Card, Section } from 'src/components/utils';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { isRoleIncluded } from 'src/utils';
import { CVPreferences } from './CVPreferences';
import { ChangePasswordCard } from './ChangePasswordCard';
import { HeaderParametres } from './HeaderParametres';
import { ParametresHelpCard } from './ParametresHelpCard';
import {
  StyledParametresLeftColumn,
  StyledParametresRightColumn,
} from './ParametresLayout.styles';
import { ProfessionalInformationCard } from './ProfessionalInformationCard';
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

  useConfirmationToaster();
  return (
    <StyledProfileLayout>
      <HeaderParametres />
      <Section className="custom-page">
        <StyledProfileGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledParametresLeftColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {/* Informations Personnelles */}
            <UserInformationCard
              title="Informations personnelles"
              loadingPersonal={loadingPersonal}
            />
            {/* Préférences du CV */}
            {isRoleIncluded(CANDIDATE_USER_ROLES, user.role) &&
              user.candidat && (
                <Card title="Préférences du CV" isMobileClosable>
                  <CVPreferences
                    userRole={user.role}
                    candidat={user.candidat}
                    candidatId={user.id}
                  />
                </Card>
              )}
            {/* Changement de mot de passe */}
            <ChangePasswordCard />
          </StyledParametresLeftColumn>

          <StyledParametresRightColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {isRoleIncluded(
              [
                USER_ROLES.COACH,
                USER_ROLES.CANDIDATE,
                USER_ROLES.CANDIDATE_EXTERNAL,
              ],
              user.role
            ) && (
              <>
                <ProfessionalInformationCard />
                <ParametresHelpCard />
                <LinkedUserInformationCard />
              </>
            )}
          </StyledParametresRightColumn>
        </StyledProfileGrid>
      </Section>
    </StyledProfileLayout>
  );
};
