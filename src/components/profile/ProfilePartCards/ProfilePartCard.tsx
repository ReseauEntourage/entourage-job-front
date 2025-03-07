import React from 'react';
import { CardTitle } from '../CardTitle/CardTitle';
import { Button, Card } from 'src/components/utils';
import {
  ProfilePartCardContent,
  StyledProfilePartCardEditButtonContainer,
} from './ProfilePartCard.style';

export interface ProfilePartCardProps {
  title: string;
  children: React.ReactNode;
  isCompleted?: boolean;
  isEditable?: boolean;
  editCallback?: () => void;
  iaGenerated?: boolean;
}

export const ProfilePartCard = ({
  title,
  children,
  editCallback,
  isCompleted = false,
  isEditable = false,
  iaGenerated = false,
}: ProfilePartCardProps) => {
  return (
    <Card
      title={
        <CardTitle
          isCompleted={isCompleted}
          title={title}
          isEditable={isEditable}
          iaGenerated={iaGenerated}
        />
      }
      isMobileClosable
      isDesktopClosable
    >
      <>
        <ProfilePartCardContent>{children}</ProfilePartCardContent>
        {isEditable && editCallback && (
          <StyledProfilePartCardEditButtonContainer>
            <Button style="custom-primary-inverted" onClick={editCallback}>
              Modifier
            </Button>
          </StyledProfilePartCardEditButtonContainer>
        )}
      </>
    </Card>
  );
};
