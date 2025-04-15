import React from 'react';
import { IlluBulleQuestion } from 'assets/icons/icons';
import { CardEmptyContent } from '../CardEmptyContent/CardEmptyContent';
import { CardTitle } from '../CardTitle/CardTitle';
import { Button, Card } from 'src/components/utils';
import { CardContent, StyledEditButtonContainer } from './Card.styles';

export interface ProfilePartCardProps {
  title: string;
  children: React.ReactNode;
  isCompleted?: boolean;
  isEditable?: boolean;
  ctaTitle?: string;
  ctaCallback?: () => void;
  iaGenerated?: boolean;
  isEmpty?: boolean;
  fallback?: {
    content: React.ReactNode;
    icon: React.ReactNode;
  };
  smallCard;
}

export const ProfilePartCard = ({
  title,
  children,
  ctaCallback,
  isCompleted,
  isEmpty = !isCompleted,
  ctaTitle = isEmpty ? 'Ajouter' : 'Modifier',
  isEditable = false,
  iaGenerated = false,
  fallback = {
    content: 'Commencez par renseigner cette partie',
    icon: <IlluBulleQuestion />,
  },
  smallCard = false,
}: ProfilePartCardProps) => {
  return (
    <Card
      title={
        <CardTitle
          isCompleted={isCompleted}
          title={title}
          isEditable={isEditable}
          iaGenerated={iaGenerated && !isEmpty}
        />
      }
      isMobileClosable
      isDesktopClosable
    >
      <>
        <CardContent>
          {isEmpty ? (
            <CardEmptyContent
              content={fallback.content}
              icon={fallback.icon}
              smallCard={smallCard}
            />
          ) : (
            children
          )}
        </CardContent>
        {ctaCallback && (
          <StyledEditButtonContainer>
            <Button style="custom-primary-inverted" onClick={ctaCallback}>
              {ctaTitle}
            </Button>
          </StyledEditButtonContainer>
        )}
      </>
    </Card>
  );
};
