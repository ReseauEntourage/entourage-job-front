import React from 'react';
import { Text } from '@/src/components/ui';
import {
  StyledContent,
  StyledHeader,
  StyledRoot,
  StyledSeparator,
} from './SidePanel.styles';

interface SidePanelProps {
  title: string;
  subtitle?: React.ReactNode;
  contentAlign?: 'start' | 'center';
  children: React.ReactNode;
}

export const SidePanel = ({
  title,
  subtitle,
  contentAlign = 'start',
  children,
}: SidePanelProps) => {
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
