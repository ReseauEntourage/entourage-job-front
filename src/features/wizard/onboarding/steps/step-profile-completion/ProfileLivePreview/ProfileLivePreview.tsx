import React from 'react';
import styled from 'styled-components';
import { ImgUserProfile, Text } from '@/src/components/ui';
import { Skeleton } from '@/src/components/ui/Skeleton/Skeleton';
import { COLORS } from '@/src/constants/styles';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { PillsSkeleton } from './PillsSkeleton';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #ffffff;
  overflow: hidden;
`;

const StyledIdentityBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const StyledName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
`;

const StyledRoleDept = styled.div`
  font-size: 13px;
  color: #666;
  text-align: center;
`;

const StyledBlocks = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledBlock = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const StyledBlockTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 6px;
`;

const StyledPill = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  background: ${COLORS.lightGray};
  font-size: 12px;
  color: #333;
  margin: 2px 3px 2px 0;
`;

const StyledPillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledExperienceItem = styled.div`
  font-size: 13px;
  color: #333;
  padding: 2px 0;
`;

export const ProfileLivePreview = () => {
  const user = useAuthenticatedUser();
  const userProfile = useCurrentUserProfile();
  const profileComplete = useCurrentUserProfileComplete();

  const displayName = user
    ? `${user.firstName} ${user.lastName?.[0] ?? ''}.`
    : '';

  return (
    <StyledContainer>
      {/* Bloc identité */}
      <StyledIdentityBlock>
        {user && (
          <ImgUserProfile
            user={user}
            size={64}
            hasPicture={userProfile?.hasPicture ?? false}
          />
        )}
        <StyledName>{displayName}</StyledName>
        {userProfile?.department && (
          <StyledRoleDept>{userProfile.department}</StyledRoleDept>
        )}
      </StyledIdentityBlock>

      <StyledBlocks>
        {/* Présentation */}
        <StyledBlock>
          <StyledBlockTitle>Présentation</StyledBlockTitle>
          {profileComplete?.introduction ? (
            <Text size="small">{profileComplete.introduction}</Text>
          ) : (
            <Skeleton height="14px" count={2} />
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
            <Skeleton height="14px" />
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
            <PillsSkeleton count={2} />
          )}
        </StyledBlock>

        {/* Compétences */}
        <StyledBlock>
          <StyledBlockTitle>Compétences</StyledBlockTitle>
          {profileComplete?.skills?.length ||
          profileComplete?.userProfileLanguages?.length ||
          profileComplete?.interests?.length ? (
            <StyledPillsRow>
              {profileComplete?.skills?.slice(0, 4).map((s, i) => (
                <StyledPill key={i}>{s.name}</StyledPill>
              ))}
              {profileComplete?.userProfileLanguages
                ?.slice(0, 2)
                .map((l, i) => (
                  <StyledPill key={`lang-${i}`}>{l.language?.name}</StyledPill>
                ))}
              {profileComplete?.interests?.slice(0, 3).map((int, i) => (
                <StyledPill key={`int-${i}`}>{int.name}</StyledPill>
              ))}
            </StyledPillsRow>
          ) : (
            <PillsSkeleton count={4} />
          )}
        </StyledBlock>

        {/* Coups de pouces */}
        <StyledBlock>
          <StyledBlockTitle>Coups de pouces</StyledBlockTitle>
          {profileComplete?.nudges?.length ? (
            <StyledPillsRow>
              {profileComplete.nudges.map((nudge) => (
                <StyledPill key={nudge.id}>{nudge.nameRequest}</StyledPill>
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
