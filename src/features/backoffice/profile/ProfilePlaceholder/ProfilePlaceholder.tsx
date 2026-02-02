import React from 'react';
import { StyledProfileCardPlaceholder } from './ProfilePlaceholder.styles';

interface ProfilePlaceHolderProps {
  image: React.ReactNode;
  description: string;
}

export const ProfilePlaceHolder = ({
  image,
  description,
}: ProfilePlaceHolderProps) => {
  return (
    <StyledProfileCardPlaceholder>
      <div>
        <div className="illu-container">{image}</div>
        <div className="text-container">
          <p>{description}</p>
        </div>
      </div>
    </StyledProfileCardPlaceholder>
  );
};
