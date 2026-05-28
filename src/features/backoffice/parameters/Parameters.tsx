import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Section } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { ParamProfessionalInformations } from '@/src/features/profile/ProfilePartCards/ParamProfessionalInformations/ParamProfessionalInformations';
import { ProfileChangePassword } from '@/src/features/profile/ProfilePartCards/ProfileChangePassword/ProfileChangePassword';
import { ProfileContactPreferences } from '@/src/features/profile/ProfilePartCards/ProfileContactPreferences/ProfileContactPreferences';
import { ProfileContracts } from '@/src/features/profile/ProfilePartCards/ProfileContracts/ProfileContracts';
import { ProfileCustomNudges } from '@/src/features/profile/ProfilePartCards/ProfileCustomNudges/ProfileCustomNudges';
import { ProfileDescription } from '@/src/features/profile/ProfilePartCards/ProfileDescription/ProfileDescription';
import { ProfileDocuments } from '@/src/features/profile/ProfilePartCards/ProfileDocuments/ProfileDocuments';
import { ProfileExperiences } from '@/src/features/profile/ProfilePartCards/ProfileExperiences/ProfileExperiences';
import { ProfileFormations } from '@/src/features/profile/ProfilePartCards/ProfileFormations/ProfileFormations';
import { ProfileInterests } from '@/src/features/profile/ProfilePartCards/ProfileInterests/ProfileInterests';
import { ProfileLanguages } from '@/src/features/profile/ProfilePartCards/ProfileLanguages/ProfileLanguages';
import { ProfileNotificationsPreferences } from '@/src/features/profile/ProfilePartCards/ProfileNotificationsPreferences/ProfileNotificationsPreferences';
import { ProfileNudges } from '@/src/features/profile/ProfilePartCards/ProfileNudges/ProfileNudges';
import { ProfileSkills } from '@/src/features/profile/ProfilePartCards/ProfileSkills/ProfileSkills';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserAchievements } from '@/src/hooks/current-user/useCurrentUserAchievements';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { useCurrentUserStats } from '@/src/hooks/current-user/useCurrentUserStats';
import { ProfileDeleteAccount } from '../../profile/ProfilePartCards/ProfileDeleteAccount/ProfileDeleteAccount';
import { ProfileLinkedInConnect } from '../../profile/ProfilePartCards/ProfileLinkedInConnect/ProfileLinkedInConnect';
import { UserProfileAvailabilityCard } from '../../profile/ProfilePartCards/UserProfileAvailabilityCard';
import {
  StyledBackofficeBackground,
  StyledBackofficeGrid,
} from '../Backoffice.styles';
import { LoadingScreen } from '../LoadingScreen';
import { HeaderProfile } from 'src/features/headers/HeaderProfile/HeaderProfile';
import { useIsDesktop } from 'src/hooks/utils';
import { currentUserActions } from 'src/use-cases/current-user';
import { notificationsActions } from 'src/use-cases/notifications';
import { AlertIA } from './AlertAI/AlertAI';
import {
  StyledParametersLeftColumn,
  StyledParametersRightColumn,
  StyledParametersSectionContent,
} from './Parameters.styles';
import { useConfirmationToaster } from './useConfirmationToaster';

export const Parameters = () => {
  const isDesktop = useIsDesktop();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const userProfile = useCurrentUserProfile();
  const userProfileComplete = useCurrentUserProfileComplete();
  const achievements = useCurrentUserAchievements();
  const userStats = useCurrentUserStats();

  useConfirmationToaster();

  useEffect(() => {
    const { linkedin } = router.query;
    if (!linkedin) {
      return;
    }

    if (linkedin === 'connected') {
      dispatch(currentUserActions.fetchUserRequested());
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: 'Compte LinkedIn lié avec succès !',
        })
      );
    } else if (linkedin === 'error') {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: 'Erreur lors de la liaison LinkedIn. Veuillez réessayer.',
        })
      );
    }

    router.replace('/backoffice/parametres', undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || !userProfileComplete) {
    return <LoadingScreen />;
  }

  return (
    <StyledBackofficeBackground>
      <HeaderProfile
        id={user.id}
        firstName={user.firstName}
        lastName={user.lastName}
        introduction={userProfileComplete.introduction ?? ''}
        role={user.role}
        gender={user.gender}
        department={userProfileComplete.department}
        isAvailable={userProfileComplete.isAvailable}
        phone={user.phone}
        email={user.email}
        hasPicture={userProfileComplete.hasPicture ?? false}
        isEditable
        createdAt={userStats?.createdAt ?? null}
        averageDelayResponse={userStats?.averageDelayResponse ?? null}
        responseRate={userStats?.responseRate ?? null}
        totalConversationWithMirrorRoleCount={
          userStats?.totalConversationWithMirrorRoleCount ?? null
        }
        lastConnection={user.lastConnection ?? null}
        achievements={achievements ?? []}
      />
      <Section className="custom-page">
        <StyledParametersSectionContent>
          <AlertIA />
          <StyledBackofficeGrid className={`${isDesktop ? '' : 'mobile'}`}>
            <StyledParametersLeftColumn
              className={`${isDesktop ? '' : 'mobile'}`}
            >
              <ParamProfessionalInformations
                sectorOccupations={userProfileComplete.sectorOccupations ?? []}
                isEditable
              />
              <ProfileDescription
                isEditable
                description={userProfileComplete.description ?? ''}
              />
              <ProfileSkills
                skills={userProfileComplete.skills ?? []}
                isEditable
              />
              <ProfileCustomNudges
                isEditable
                customNudges={userProfileComplete.customNudges ?? []}
                firstName={user.firstName}
                role={user.role}
                userId={user.id}
                ownProfile
              />
              <ProfileExperiences
                userId={user.id}
                userFirstName={user.firstName}
                userRole={user.role}
                experiences={userProfileComplete.experiences ?? []}
                isEditable
              />
              <ProfileFormations
                userId={user.id}
                userFirstName={user.firstName}
                userRole={user.role}
                formations={userProfileComplete.formations ?? []}
                isEditable
              />
            </StyledParametersLeftColumn>
            <StyledParametersRightColumn
              className={`${isDesktop ? '' : 'mobile'}`}
            >
              <ProfileDocuments
                userId={user.id}
                linkedinUrl={userProfileComplete.linkedinUrl}
                hasExternalCv={userProfileComplete.hasExternalCv}
                isEditable
              />
              <ProfileLinkedInConnect />
              <ProfileLanguages
                userProfileLanguages={userProfileComplete.userProfileLanguages}
                isEditable
              />
              <ProfileInterests
                interests={userProfileComplete.interests}
                isEditable
              />
              {user.role === UserRoles.CANDIDATE && (
                <ProfileContracts
                  contracts={userProfileComplete.contracts}
                  isEditable
                />
              )}
              <UserProfileAvailabilityCard />
              <ProfileContactPreferences userRole={user.role} isEditable />
              <ProfileNudges
                userRole={user.role}
                nudges={userProfileComplete.nudges || []}
                isEditable
              />
              <ProfileNotificationsPreferences userProfile={userProfile} />
              <ProfileChangePassword />
              <ProfileDeleteAccount />
            </StyledParametersRightColumn>
          </StyledBackofficeGrid>
        </StyledParametersSectionContent>
      </Section>
    </StyledBackofficeBackground>
  );
};
