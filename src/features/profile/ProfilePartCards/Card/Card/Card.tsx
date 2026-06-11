import React from 'react';
import { Button, Card } from '@/src/components/ui';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { CardEmptyContent } from '../CardEmptyContent/CardEmptyContent';
import { CardTitle } from '../CardTitle/CardTitle';
import { CardContent, StyledEditButtonContainer } from './Card.styles';

interface ProfilePartCardProps {
  title: string;
  children: React.ReactNode;
  isCompleted?: boolean;
  isEditable?: boolean;
  ctaTitle?: string | null;
  ctaCallback?: () => void;
  iaGenerated?: boolean;
  isEmpty?: boolean;
  fallback?: {
    title?: string;
    content: React.ReactNode;
    icon: React.ReactNode;
  };
  isDefaultOpen?: boolean;
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
    icon: <SvgIcon name="IlluBulleQuestion" width={35} height={30} />,
  },
  isDefaultOpen = true,
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
      isDefaultOpen={isDefaultOpen}
    >
      <>
        <CardContent>
          {isEmpty ? (
            <CardEmptyContent
              title={fallback?.title}
              content={fallback.content}
              icon={fallback.icon}
            />
          ) : (
            children
          )}
        </CardContent>
        {ctaCallback && ctaTitle && (
          <StyledEditButtonContainer>
            <Button variant="secondary" onClick={ctaCallback} rounded>
              {ctaTitle}
            </Button>
          </StyledEditButtonContainer>
        )}
      </>
    </Card>
  );
};
