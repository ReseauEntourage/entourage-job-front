import React from 'react';
import { Alert } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import {
  StyledCardEmptyContent,
  StyledContentContainer,
} from './CardEmptyContent.styles';

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
      <StyledCardEmptyContent>
        {/* Display icon with correct props */}
        <StyledContentContainer>{content}</StyledContentContainer>
      </StyledCardEmptyContent>
    </Alert>
  );
};
