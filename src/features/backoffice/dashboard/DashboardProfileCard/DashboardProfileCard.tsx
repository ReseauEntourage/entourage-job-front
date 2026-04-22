import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SvgIcon } from '@/assets/icons/icons';
import {
  Button,
  Card,
  ImgUserProfile,
  Tag,
  TagSize,
  Text,
} from '@/src/components/ui';
import { AvailabilityTag } from '@/src/components/ui/AvailabilityTag';
import { Dot } from '@/src/components/ui/Dot/Dot';
import { FilePreviewCV } from '@/src/components/ui/Inputs/FileInput/FilePreview';
import { ProfileNudges } from '@/src/constants/nudges';
import { ProfileCompletion } from '@/src/features/headers/HeaderProfile/ProfileCompletion/ProfileCompletion';
import { ProfileAchievementHighlighter } from '@/src/features/profile/ProfileAchievementHighlighter';
import { useCurrentUserExternalCv } from '@/src/hooks/useCurrentUserExternalCv';
import { currentUserActions } from '@/src/use-cases/current-user';
import { selectProfileCompletionRate } from '@/src/use-cases/profile-completion';
import { useContextualRole } from '../../useContextualRole';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserAchievements } from 'src/hooks/current-user/useCurrentUserAchievements';
import { useCurrentUserOrganization } from 'src/hooks/current-user/useCurrentUserOrganization';
import { useCurrentUserProfile } from 'src/hooks/current-user/useCurrentUserProfile';
import {
  StyledDashboardCTAContainer,
  StyledDashboardProfileCardIntroduction,
  StyledDashboardProfileCardHelpList,
  StyledDashboardProfileCardPictureName,
  StyledDashboardProfileCardSection,
  StyledDashboardProfileCardSectionTitle,
  StyledDashbardProfileCardSectionContainer,
  StyledDashboardProfileCardEmptyState,
  StyledDashboardProfileCardMainInfos,
  StyledTagList,
} from './DashboardProfileCard.styles';

export const DashboardProfileCard = () => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
  const userProfile = useCurrentUserProfile();
  const organization = useCurrentUserOrganization();
  const achievements = useCurrentUserAchievements();
  const externalCv = useCurrentUserExternalCv();
  const { contextualRole } = useContextualRole(user.role);
  const completionRate = useSelector(selectProfileCompletionRate);

  const buttonText = completionRate < 100 ? 'Compléter' : 'Modifier';

  const openExternalCV = () => {
    if (externalCv === null) {
      return;
    }
    window.open(externalCv, '_blank');
  };

  const removeExternalCvCallback = () => {
    dispatch(currentUserActions.deleteExternalCvRequested());
  };

  return (
    <Card dataTestId="dashboard-profile-card">
      <StyledDashboardProfileCardPictureName>
        <ImgUserProfile
          user={user}
          size={69}
          hasPicture={userProfile?.hasPicture || false}
        />
        <StyledDashboardProfileCardMainInfos>
          <Text size="xlarge" weight="bold">
            {`${user.firstName} ${user.lastName.charAt(0).toUpperCase()}.`}
          </Text>
          {organization && <Text>{organization.name}</Text>}
          {userProfile?.department && <Text>{userProfile.department}</Text>}
          <StyledTagList>
            <AvailabilityTag isAvailable={userProfile?.isAvailable ?? false} />
            {achievements && achievements.length > 0 && (
              <ProfileAchievementHighlighter
                achievement={achievements[0]}
                gender={user.gender}
              />
            )}
          </StyledTagList>
        </StyledDashboardProfileCardMainInfos>
      </StyledDashboardProfileCardPictureName>

      {/* Completion rate bar */}
      <ProfileCompletion />

      <StyledDashbardProfileCardSectionContainer>
        {/* Completion presentation */}
        <StyledDashboardProfileCardSection>
          <StyledDashboardProfileCardSectionTitle>
            <Dot color={userProfile?.introduction ? 'green' : 'lightRed'} />
            <Text size="large" weight="semibold">
              Présentation
            </Text>
          </StyledDashboardProfileCardSectionTitle>
          <StyledDashboardProfileCardIntroduction>
            {userProfile?.introduction ? (
              <Text size="small">{userProfile.introduction}</Text>
            ) : (
              <StyledDashboardProfileCardEmptyState>
                <SvgIcon name="IlluBulleQuestion" height={48} width={48} />
                <Text size="small">
                  Vous n’avez pas encore rédigé votre présentation
                </Text>
              </StyledDashboardProfileCardEmptyState>
            )}
          </StyledDashboardProfileCardIntroduction>
        </StyledDashboardProfileCardSection>

        {/* Completion nudges */}
        <StyledDashboardProfileCardSection>
          <StyledDashboardProfileCardSectionTitle>
            <Dot color={userProfile?.nudges?.length ? 'green' : 'lightRed'} />
            <Text size="large" weight="semibold">
              Mes coups de pouce
            </Text>
          </StyledDashboardProfileCardSectionTitle>
          {userProfile?.nudges && userProfile.nudges.length > 0 ? (
            <StyledDashboardProfileCardHelpList>
              {userProfile.nudges.slice(0, 3).map((nudge, index) => {
                const nudgeDetails = ProfileNudges.find(
                  (nudgeConstant) => nudgeConstant.value === nudge?.value
                );
                if (nudgeDetails) {
                  const tagContent = nudgeDetails.shortTitle[contextualRole];
                  return (
                    <Tag size={TagSize.Small} key={index}>
                      {tagContent}
                    </Tag>
                  );
                }
                return null;
              })}
              {(userProfile?.nudges?.length ?? 0) > 3 && (
                <Tag size={TagSize.Small}>
                  +{(userProfile?.nudges?.length ?? 0) - 3}
                </Tag>
              )}
            </StyledDashboardProfileCardHelpList>
          ) : (
            <StyledDashboardProfileCardEmptyState>
              <SvgIcon
                name="IlluCoeurMainsOuvertesBleu"
                height={48}
                width={48}
              />

              <Text size="small">
                {user.role === UserRoles.CANDIDATE
                  ? 'Vous n’avez pas encore sélectionné les coups de pouces dont vous auriez besoin'
                  : 'Vous n’avez pas encore sélectionné de coups de pouces que vous souhaitez donner'}
              </Text>
            </StyledDashboardProfileCardEmptyState>
          )}
        </StyledDashboardProfileCardSection>

        {/* External CV Completion */}
        <StyledDashboardProfileCardSection>
          <StyledDashboardProfileCardSectionTitle>
            <Dot color={userProfile?.hasExternalCv ? 'green' : 'lightRed'} />
            <Text size="large" weight="semibold">
              Mon CV
            </Text>
          </StyledDashboardProfileCardSectionTitle>
          <StyledDashboardProfileCardIntroduction>
            {userProfile?.hasExternalCv ? (
              <FilePreviewCV
                filename="Votre CV"
                onRemoveFile={removeExternalCvCallback}
                onOpenFile={openExternalCV}
                dataTestId="dashboard-profile-card-cv-preview"
                size={48}
                textSize="small"
              />
            ) : (
              <StyledDashboardProfileCardEmptyState>
                <SvgIcon name="IlluCandidatFolder" height={48} width={48} />
                <Text size="small">
                  Vous n&apos;avez pas importé de CV existant vous permettant de
                  générer votre profil.
                </Text>
              </StyledDashboardProfileCardEmptyState>
            )}
          </StyledDashboardProfileCardIntroduction>
        </StyledDashboardProfileCardSection>
      </StyledDashbardProfileCardSectionContainer>

      <StyledDashboardCTAContainer>
        <Button variant="secondary" rounded href="/backoffice/parametres">
          {buttonText}
        </Button>
      </StyledDashboardCTAContainer>
    </Card>
  );
};
