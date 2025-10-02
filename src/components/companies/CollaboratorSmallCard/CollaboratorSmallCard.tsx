import React, { useCallback } from 'react';
import { User } from '@/src/api/types';
import { ImgUserProfile, LegacyImg, Text } from '@/src/components/utils';
import { useIsMobile } from '@/src/hooks/utils';
import {
  StyledCollaboratorSmallCardContainer,
  StyledCollaboratorSmallCardInfosContainer,
  StyledCollaboratorSmallCardPictureContainerStyled,
} from './CollaboratorSmallCard.styles';

interface CollaboratorSmallCardProps {
  user?: User;
  email?: string;
}

export const CollaboratorSmallCard = ({
  user,
  email,
}: CollaboratorSmallCardProps) => {
  const openProfile = useCallback(() => {
    if (user) {
      window.location.href = `/backoffice/profile/${user.id}`;
    }
  }, [user]);

  const isMobile = useIsMobile();
  return (
    <StyledCollaboratorSmallCardContainer
      pointer={!!user}
      onClick={user ? openProfile : undefined}
    >
      {!!user && (
        <div>
          <ImgUserProfile
            user={user}
            hasPicture={user.userProfile.hasPicture}
            size={isMobile ? 50 : 80}
          />
        </div>
      )}
      {!!email && (
        <StyledCollaboratorSmallCardPictureContainerStyled>
          <LegacyImg
            src="/static/img/profile-placeholder.png"
            alt="Default Profile"
            cover
          />
        </StyledCollaboratorSmallCardPictureContainerStyled>
      )}
      <StyledCollaboratorSmallCardInfosContainer>
        {!!user && (
          <>
            <Text weight="semibold">
              {user.firstName} {user.lastName.charAt(0).toUpperCase()}.
            </Text>
            {user.userProfile.currentJob && (
              <Text color="darkGray">{user.userProfile.currentJob} </Text>
            )}
          </>
        )}
        {!!email && (
          <>
            <Text weight="semibold">{email}</Text>
            <Text color="darkGray">Invitation envoyée</Text>
          </>
        )}
      </StyledCollaboratorSmallCardInfosContainer>
    </StyledCollaboratorSmallCardContainer>
  );
};
