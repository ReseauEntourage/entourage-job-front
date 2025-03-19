import React from 'react';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../../Backoffice.styles';
import { useConfirmationToaster } from '../useConfirmationToaster';
import { HeaderProfile } from 'src/components/headers/HeaderProfile';
import { Card, Section } from 'src/components/utils';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useIsDesktop } from 'src/hooks/utils';
import { isRoleIncluded } from 'src/utils';
import { CVPreferences } from './CVPreferences';
import { ChangePasswordCard } from './ChangePasswordCard';
import { ExternalCVCard } from './ExternalCVCard';
import { ParametresHelpCard } from './ParametresHelpCard';
import {
  StyledParametresLeftColumn,
  StyledParametresRightColumn,
} from './ParametresLayout.styles';
import { ProfessionalInformationCard } from './ProfessionalInformationCard';
import {
  LinkedUserInformationCard,
  UserInformationCard,
} from './UserInformationCard';
import { DeleteAccountCard } from './UserInformationCard/DeleteAccountCard/DeleteAccountCard';

export const ParametresLayout = () => {
  const isDesktop = useIsDesktop();
  const user = useAuthenticatedUser();

  useConfirmationToaster();

  return (
    <StyledBackofficeBackground>
      <HeaderProfile
        id={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        description={user.userProfile.description ?? ''}
        role={user.role}
        department={user.userProfile.department}
        isAvailable={user.userProfile.isAvailable}
        hasExternalCv={user.userProfile.hasExternalCv}
        isEditable
      />
      <Section className="custom-page">
        <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledParametresLeftColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {/* Informations Personnelles */}
            <UserInformationCard title="Informations personnelles" />
            {/* Télécharger mon CV */}
            {user.role === USER_ROLES.CANDIDATE && user.candidat && (
              <ExternalCVCard dataTestId="external-cv-card-params" />
            )}
            {/* Préférences du CV */}
            {user.role === USER_ROLES.CANDIDATE && user.candidat && (
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
              [USER_ROLES.COACH, USER_ROLES.CANDIDATE],
              user.role
            ) && (
              <>
                <ProfessionalInformationCard />
                <ParametresHelpCard />
                <LinkedUserInformationCard />
              </>
            )}
            {isRoleIncluded(
              [USER_ROLES.COACH, USER_ROLES.CANDIDATE, USER_ROLES.REFERER],
              user.role
            ) && <DeleteAccountCard />}
          </StyledParametresRightColumn>
        </StyledBackofficeGrid>
      </Section>
    </StyledBackofficeBackground>
  );
};
