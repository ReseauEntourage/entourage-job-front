import React from 'react';
import { Badge, BadgeVariant, ImgUserProfile, Text } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { useContextualRole } from '@/src/features/backoffice/useContextualRole';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { PillsSkeleton } from './PillsSkeleton';
import {
  StyledBlock,
  StyledBlocks,
  StyledBlockTitle,
  StyledContainer,
  StyledExperienceItem,
  StyledIdentityBlock,
  StyledImgProfileAndName,
  StyledPillsRow,
} from './ProfileLivePreview.styles';

export const ProfileLivePreview = () => {
  const user = useAuthenticatedUser();
  const { contextualRole } = useContextualRole(user?.role);
  const userProfile = useCurrentUserProfile();
  const profileComplete = useCurrentUserProfileComplete();

  const displayName = user
    ? `${user.firstName} ${user.lastName?.[0] ?? ''}.`
    : '';

  return (
    <StyledContainer>
      {/* Bloc identité */}
      <StyledIdentityBlock>
        <StyledImgProfileAndName>
          {user && (
            <ImgUserProfile
              user={user}
              size={64}
              hasPicture={userProfile?.hasPicture ?? false}
            />
          )}
          <div>
            <Text weight="semibold">{displayName}</Text>
            {userProfile?.department && (
              <Text color="mediumGray">{userProfile.department}</Text>
            )}
          </div>
        </StyledImgProfileAndName>
        <Badge variant={BadgeVariant.ExtraLightTeal} size="small">
          {user.role === UserRoles.ADMIN ? UserRoles.ADMIN : contextualRole}
        </Badge>
      </StyledIdentityBlock>

      <StyledBlocks>
        {/* Présentation */}
        <StyledBlock>
          <StyledBlockTitle>Présentation</StyledBlockTitle>
          {profileComplete?.description ? (
            <Text size="small">{profileComplete.description}</Text>
          ) : (
            <PillsSkeleton count={3} />
          )}
        </StyledBlock>

        {/* Informations professionnelles */}
        <StyledBlock>
          <StyledBlockTitle>Informations professionnelles</StyledBlockTitle>
          {profileComplete?.currentJob ||
          profileComplete?.sectorOccupations?.length ? (
            <>
              {profileComplete?.currentJob && (
                <Text size="small">{profileComplete.currentJob}</Text>
              )}
              {profileComplete?.sectorOccupations?.slice(0, 1).map((so, i) => (
                <Text key={i} size="small" color="darkGray">
                  {so.businessSector?.name}
                </Text>
              ))}
            </>
          ) : (
            <PillsSkeleton count={2} />
          )}
        </StyledBlock>

        {/* Expériences */}
        <StyledBlock>
          <StyledBlockTitle>Expériences</StyledBlockTitle>
          {profileComplete?.experiences?.length ? (
            profileComplete.experiences.slice(0, 3).map((exp, i) => (
              <StyledExperienceItem key={exp.id ?? i}>
                {exp.title}
                {exp.company ? ` — ${exp.company}` : ''}
              </StyledExperienceItem>
            ))
          ) : (
            <PillsSkeleton count={2} />
          )}
        </StyledBlock>

        {/* Formations */}
        <StyledBlock>
          <StyledBlockTitle>Formations</StyledBlockTitle>
          {profileComplete?.formations?.length ? (
            profileComplete.formations.slice(0, 2).map((f, i) => (
              <StyledExperienceItem key={f.id ?? i}>
                {f.title}
                {f.institution ? ` — ${f.institution}` : ''}
              </StyledExperienceItem>
            ))
          ) : (
            <PillsSkeleton count={1} />
          )}
        </StyledBlock>

        {/* Compétences */}
        <StyledBlock>
          <StyledBlockTitle>
            Compétences, langues, centres d'intérêt
          </StyledBlockTitle>
          {profileComplete?.skills?.length ||
          profileComplete?.userProfileLanguages?.length ||
          profileComplete?.interests?.length ? (
            <StyledPillsRow>
              {profileComplete?.skills?.slice(0, 4).map((s, i) => (
                <Badge variant={BadgeVariant.ExtraLightTeal} key={`skill-${i}`}>
                  {s.name}
                </Badge>
              ))}
              {profileComplete?.userProfileLanguages
                ?.slice(0, 2)
                .map((l, i) => (
                  <Badge
                    variant={BadgeVariant.ExtraLightTeal}
                    key={`lang-${i}`}
                  >
                    {l.language?.name}
                  </Badge>
                ))}
              {profileComplete?.interests?.slice(0, 3).map((int, i) => (
                <Badge variant={BadgeVariant.ExtraLightTeal} key={`int-${i}`}>
                  {int.name}
                </Badge>
              ))}
            </StyledPillsRow>
          ) : (
            <PillsSkeleton count={2} />
          )}
        </StyledBlock>

        {/* Coups de pouces */}
        <StyledBlock>
          <StyledBlockTitle>Coups de pouces</StyledBlockTitle>
          {profileComplete?.nudges?.length ? (
            <StyledPillsRow>
              {profileComplete.nudges.map((nudge) => (
                <Badge variant={BadgeVariant.ExtraLightTeal} key={nudge.id}>
                  {nudge.nameRequest}
                </Badge>
              ))}
            </StyledPillsRow>
          ) : (
            <PillsSkeleton count={3} />
          )}
        </StyledBlock>
      </StyledBlocks>
    </StyledContainer>
  );
};
