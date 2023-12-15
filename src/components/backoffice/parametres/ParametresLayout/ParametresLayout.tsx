import React, { useState } from 'react';
import UIkit from 'uikit';
import { useParametres } from '../useParametres';
import { Api } from 'src/api';
import { User, UserWithUserCandidate } from 'src/api/types';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formChangePassword } from 'src/components/forms/schemas/formChangePassword';
import { Card, Section } from 'src/components/utils';
import { CANDIDATE_USER_ROLES, USER_ROLES } from 'src/constants/users';
import { useIsDesktop } from 'src/hooks/utils';
import { useResetForm } from 'src/hooks/utils/useResetForm';
import { isRoleIncluded } from 'src/utils';
import { CVPreferences } from './CVPreferences';
import { HeaderParametres } from './HeaderParametres';
import {
  LinkedUserInformationCard,
  UserInformationCard,
} from './InformationsPersonnelles';
import {
  StyledParametresGrid,
  StyledParametresLayout,
  StyledParametresLeftColumn,
  StyledParametresRightColumn,
} from './ParametresLayout.styles';
import { PasswordCriterias } from './PasswordCriterias';

interface ParametresLayoutProps {
  user: User | UserWithUserCandidate;
  userData: UserWithUserCandidate;
  setUserData: (
    updatedUserData:
      | UserWithUserCandidate
      | ((
          prevUserData: UserWithUserCandidate | undefined
        ) => UserWithUserCandidate | undefined)
  ) => void;
  loadingPersonal: boolean;
}

export const ParametresLayout = ({
  user,
  userData,
  setUserData,
  loadingPersonal,
}: ParametresLayoutProps) => {
  const [form, resetForm] = useResetForm();
  const [loadingPassword, setLoadingPassword] = useState(false);

  const { openCorrespondingModal } = useParametres(userData, user, setUserData);

  const isDesktop = useIsDesktop();

  return (
    <StyledParametresLayout>
      <HeaderParametres userData={userData} />
      <Section className="custom-page">
        <StyledParametresGrid className={`${isDesktop ? '' : 'mobile'}`}>
          <StyledParametresLeftColumn
            className={`${isDesktop ? '' : 'mobile'}`}
          >
            {/* Informations Personnelles */}
            <UserInformationCard
              title="Informations personnelles"
              openCorrespondingModal={openCorrespondingModal}
              loadingPersonal={loadingPersonal}
              userData={userData}
            />
            {/* Préférences du CV */}
            {isRoleIncluded(CANDIDATE_USER_ROLES, userData.role) && (
              <CVPreferences userData={userData} setUserData={setUserData} />
            )}
            {/* Changement de mot de passe */}
            <Card
              title="Modification du mot de passe"
              isLoading={loadingPassword}
              isMobileClosable
            >
              <PasswordCriterias />
              <FormWithValidation
                innerRef={form}
                submitText="Modifier"
                formSchema={formChangePassword}
                onSubmit={async ({ newPassword, oldPassword }, setError) => {
                  setLoadingPassword(true);
                  try {
                    await Api.putUserChangePwd({
                      newPassword,
                      oldPassword,
                    });
                    UIkit.notification(
                      'Nouveau mot de passe enregistré',
                      'success'
                    );
                    resetForm();
                    setError('');
                    setLoadingPassword(false);
                  } catch (err) {
                    console.error(err);
                    setError("L'ancien mot de passe n'est pas valide");
                    setLoadingPassword(false);
                  }
                }}
              />
            </Card>
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
              userData.role
            ) && <LinkedUserInformationCard user={userData} />}
          </StyledParametresRightColumn>
        </StyledParametresGrid>
      </Section>
    </StyledParametresLayout>
  );
};