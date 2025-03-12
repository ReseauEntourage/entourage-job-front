import React from 'react';
import { CardTitle } from '../CardTitle/CardTitle';
import { Button, Card } from 'src/components/utils';
import { CardContent, StyledEditButtonContainer } from './Card.styles';

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
  isCompleted,
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
        <CardContent>{children}</CardContent>
        {isEditable && editCallback && (
          <StyledEditButtonContainer>
            <Button style="custom-primary-inverted" onClick={editCallback}>
              Modifier
            </Button>
          </StyledEditButtonContainer>
        )}
      </>
    </Card>
  );
};
