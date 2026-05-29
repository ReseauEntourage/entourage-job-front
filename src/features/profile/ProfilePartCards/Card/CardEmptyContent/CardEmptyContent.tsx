import React from 'react';
import { Alert } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { StyledContentContainer } from './CardEmptyContent.styles';

interface CardEmptyContentProps {
  title?: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

export const CardEmptyContent = ({
  title,
  content,
  icon,
}: CardEmptyContentProps) => {
  return (
    <Alert
      type={AlertType.Info}
      icon={icon}
      variant="outlined"
      title={title}
      iconInContainer
    >
      <StyledContentContainer>{content}</StyledContentContainer>
    </Alert>
  );
};
