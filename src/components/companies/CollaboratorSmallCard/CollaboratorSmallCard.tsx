import React from 'react';
import { User } from '@/src/api/types';
import { Img, ImgProfile, Text } from '@/src/components/utils';
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
  const openProfile = () => {
    if (user) {
      window.location.href = `/backoffice/profile/${user.id}`;
    }
  };

  return (
    <StyledCollaboratorSmallCardContainer
      pointer={user}
      onClick={user ? openProfile : undefined}
    >
      {user && (
        <div>
          <ImgProfile
            user={user}
            hasPicture={user.userProfile.hasPicture}
            size={80}
          />
        </div>
      )}
      {!user && email && (
        <StyledCollaboratorSmallCardPictureContainerStyled>
          <Img
            src="/static/img/profile-placeholder.png"
            alt="Default Profile"
            cover
          />
        </StyledCollaboratorSmallCardPictureContainerStyled>
      )}
      <StyledCollaboratorSmallCardInfosContainer>
        {user ? (
          <>
            <Text weight="semibold">
              {user.firstName} {user.lastName.charAt(0).toUpperCase()}.
            </Text>
            <Text color="darkGray">
              Juriste en droit des affaires en droit des affaires en droit des
              affaires
            </Text>
          </>
        ) : (
          <>
            <Text weight="semibold">{email}</Text>
            <Text color="darkGray">Invitation envoyée</Text>
          </>
        )}
      </StyledCollaboratorSmallCardInfosContainer>
    </StyledCollaboratorSmallCardContainer>
  );
};
