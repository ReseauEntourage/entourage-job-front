import React from 'react';
import { Text } from '@/src/components/ui';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  SidePanelVariant,
  StyledContent,
  StyledHeader,
  StyledRoot,
  StyledSeparator,
  VARIANT_STYLES,
} from './SidePanel.styles';

interface SidePanelProps {
  variant: SidePanelVariant;
  title?: string;
  subtitle?: React.ReactNode;
  contentAlign?: 'start' | 'center';
  children: React.ReactNode;
}

export const SidePanel = ({
  variant,
  title,
  subtitle,
  contentAlign = 'start',
  children,
}: SidePanelProps) => {
  const isDesktop = useIsDesktop();
  const { background, titleColor } =
    VARIANT_STYLES[isDesktop ? variant : 'white'];
  const hasHeader = Boolean(title);

  return (
    <StyledRoot $background={background} $hasHeader={hasHeader}>
      {hasHeader && (
        <>
          <StyledHeader>
            <Text weight="semibold" uppercase color={titleColor}>
              {title}
            </Text>
            {subtitle}
          </StyledHeader>
          <StyledSeparator />
        </>
      )}
      <StyledContent $align={contentAlign} $hasHeader={hasHeader}>
        {children}
      </StyledContent>
    </StyledRoot>
  );
};
