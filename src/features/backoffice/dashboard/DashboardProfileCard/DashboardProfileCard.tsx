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
import { Dot } from '@/src/components/ui/Dot/Dot';
import { FilePreviewCV } from '@/src/components/ui/Inputs/FileInput/FilePreview';
import { ProfileNudges } from '@/src/constants/nudges';
import { ProfileCompletion } from '@/src/features/headers/HeaderProfile/ProfileCompletion/ProfileCompletion';
import { useCurrentUserExternalCv } from '@/src/hooks/useCurrentUserExternalCv';
import { currentUserActions } from '@/src/use-cases/current-user';
import { selectProfileCompletionRate } from '@/src/use-cases/profile-completion';
import { useContextualRole } from '../../useContextualRole';
import { UserRoles } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  StyledDashboardCTAContainer,
  StyledDashboardProfileCardIntroduction,
  StyledDashboardProfileCardHelpList,
  StyledDashboardProfileCardPictureName,
  StyledDashboardProfileCardSection,
  StyledDashboardProfileCardSectionTitle,
  StyledDashbardProfileCardSectionContainer,
  StyledDashboardProfileCardEmptyState,
  StyledDashboardProfileCardCompletionContainer,
} from './DashboardProfileCard.styles';

export const DashboardProfileCard = () => {
  const dispatch = useDispatch();
  const user = useAuthenticatedUser();
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
          hasPicture={user.userProfile?.hasPicture || false}
        />
        <div>
          <Text size="xlarge" weight="bold">
            {`${user.firstName} ${user.lastName.charAt(0).toUpperCase()}.`}
          </Text>
          {user.organization && <Text>{user.organization.name}</Text>}
          {user.userProfile.department && (
            <Text>{user.userProfile.department}</Text>
          )}
        </div>
      </StyledDashboardProfileCardPictureName>

      {/* Completion rate bar */}
      <StyledDashboardProfileCardCompletionContainer>
        <ProfileCompletion />
      </StyledDashboardProfileCardCompletionContainer>

      <StyledDashbardProfileCardSectionContainer>
        {/* Completion presentation */}
        <StyledDashboardProfileCardSection>
          <StyledDashboardProfileCardSectionTitle>
            <Dot color={user.userProfile.introduction ? 'green' : 'lightRed'} />
            <Text size="large" weight="semibold">
              Présentation
            </Text>
          </StyledDashboardProfileCardSectionTitle>
          <StyledDashboardProfileCardIntroduction>
            {user.userProfile.introduction ? (
              <Text size="small">{user.userProfile.introduction}</Text>
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
            <Dot
              color={user.userProfile.nudges?.length ? 'green' : 'lightRed'}
            />
            <Text size="large" weight="semibold">
              Mes coups de pouce
            </Text>
          </StyledDashboardProfileCardSectionTitle>
          {user.userProfile.nudges && user.userProfile.nudges.length > 0 ? (
            <StyledDashboardProfileCardHelpList>
              {user.userProfile.nudges.slice(0, 3).map((nudge, index) => {
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
              {user.userProfile.nudges?.length > 3 && (
                <Tag size={TagSize.Small}>
                  +${user.userProfile.nudges.length - 3}
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
            <Dot
              color={user.userProfile.hasExternalCv ? 'green' : 'lightRed'}
            />
            <Text size="large" weight="semibold">
              Mon CV
            </Text>
          </StyledDashboardProfileCardSectionTitle>
          <StyledDashboardProfileCardIntroduction>
            {user.userProfile.hasExternalCv ? (
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
