import React from 'react';
import { Text } from '@/src/components/ui';
import {
  StyledContent,
  StyledHeader,
  StyledRoot,
  StyledSeparator,
} from './WizardSidePanel.styles';

interface WizardSidePanelProps {
  title: string;
  subtitle?: React.ReactNode;
  contentAlign?: 'start' | 'center';
  children: React.ReactNode;
}

export const WizardSidePanel = ({
  title,
  subtitle,
  contentAlign = 'start',
  children,
}: WizardSidePanelProps) => {
  return (
    <StyledRoot>
      <StyledHeader>
        <Text weight="semibold" uppercase>
          {title}
        </Text>
        {subtitle}
      </StyledHeader>
      <StyledSeparator />
      <StyledContent $align={contentAlign}>{children}</StyledContent>
    </StyledRoot>
  );
};
