import React from 'react';
import { useDispatch } from 'react-redux';
import { ProfileCompletion } from '@/src/components/headers/HeaderProfile/ProfileCompletion/ProfileCompletion';
import { RoundBadge } from '@/src/components/utils/Badge/RoundBadge';
import { FilePreviewCV } from '@/src/components/utils/Inputs/FileInput/FilePreview';
import { ProfileHelps } from '@/src/constants/nudges';
import { useCurrentUserExternalCv } from '@/src/hooks/useCurrentUserExternalCv';
import { currentUserActions } from '@/src/use-cases/current-user';
import {
  IlluBulleQuestion,
  IlluCandidatFolder,
  IlluCoeurMainsOuvertesBleu,
} from 'assets/icons/icons';
import { useContextualRole } from '../../useContextualRole';
import { Button, Card, ImgProfile, Tag, Text } from 'src/components/utils';
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

  const openExternalCV = () => {
    if (externalCv === null) return;
    window.open(externalCv, '_blank');
  };

  const removeExternalCvCallback = () => {
    dispatch(currentUserActions.deleteExternalCvRequested());
  };

  return (
    <Card dataTestId="dashboard-profile-card">
      <StyledDashboardProfileCardPictureName>
        <ImgProfile user={user} size={69} />
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
            <RoundBadge
              color={user.userProfile.introduction ? 'green' : 'lightRed'}
            />
            <Text size="large" weight="semibold">
              Présentation
            </Text>
          </StyledDashboardProfileCardSectionTitle>
          <StyledDashboardProfileCardIntroduction>
            {user.userProfile.introduction ? (
              <Text size="small">{user.userProfile.introduction}</Text>
            ) : (
              <StyledDashboardProfileCardEmptyState>
                <IlluBulleQuestion height={48} width={48} />
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
            <RoundBadge
              color={user.userProfile.nudges?.length ? 'green' : 'lightRed'}
            />
            <Text size="large" weight="semibold">
              Mes coups de pouce
            </Text>
          </StyledDashboardProfileCardSectionTitle>
          {user.userProfile.nudges && user.userProfile.nudges.length > 0 ? (
            <StyledDashboardProfileCardHelpList>
              {user.userProfile.nudges.slice(0, 3).map((nudge, index) => {
                const nudgeDetails = ProfileHelps.find(
                  (nudgeConstant) => nudgeConstant.value === nudge?.value
                );
                if (nudgeDetails) {
                  const tagContent = nudgeDetails.shortTitle[contextualRole];
                  return <Tag size="small" key={index} content={tagContent} />;
                }
                return null;
              })}
              {user.userProfile.nudges?.length > 3 && (
                <Tag
                  size="small"
                  content={`+${user.userProfile.nudges.length - 3}`}
                />
              )}
            </StyledDashboardProfileCardHelpList>
          ) : (
            <StyledDashboardProfileCardEmptyState>
              <IlluCoeurMainsOuvertesBleu height={48} width={48} />

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
            <RoundBadge
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
                <IlluCandidatFolder height={48} width={48} />
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
          Modifier
        </Button>
      </StyledDashboardCTAContainer>
    </Card>
  );
};
