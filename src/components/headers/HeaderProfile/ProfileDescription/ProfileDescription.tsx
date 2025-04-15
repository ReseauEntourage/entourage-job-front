import React from 'react';
import {
  StyledDescriptionContainer,
  StyledDescriptionParagraphe,
} from './ProfileDescription.styles';

interface ProfileDescriptionProps {
  description: string;
}

export const ProfileDescription = ({
  description,
}: ProfileDescriptionProps) => {
  return (
    <StyledDescriptionContainer>
      {description && (
        <StyledDescriptionParagraphe data-testid="profile-description">
          &ldquo;{description}&rdquo;
        </StyledDescriptionParagraphe>
      )}
    </StyledDescriptionContainer>
  );
};
