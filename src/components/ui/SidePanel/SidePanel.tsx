import React from 'react';
import { Text } from '@/src/components/ui';
import { useIsDesktop } from '@/src/hooks/utils';
import {
  PHOTO_BASE_GRADIENT,
  SidePanelVariant,
  StyledContent,
  StyledHeader,
  StyledPhotoLayer,
  StyledPhotoOverlay,
  StyledRoot,
  StyledSeparator,
  VARIANT_STYLES,
} from './SidePanel.styles';

interface SidePanelProps {
  variant: SidePanelVariant;
  title?: string;
  subtitle?: React.ReactNode;
  contentAlign?: 'start' | 'center';
  backgroundPhoto?: { src: string; position?: string };
  children: React.ReactNode;
}

export const SidePanel = ({
  variant,
  title,
  subtitle,
  contentAlign = 'start',
  backgroundPhoto,
  children,
}: SidePanelProps) => {
  const isDesktop = useIsDesktop();
  const effectiveVariant = isDesktop ? variant : 'white';
  const hasPhoto =
    effectiveVariant === 'blue-gradient' && Boolean(backgroundPhoto);
  const { background, titleColor } = VARIANT_STYLES[effectiveVariant];
  const hasHeader = Boolean(title);

  return (
    <StyledRoot
      $background={hasPhoto ? PHOTO_BASE_GRADIENT : background}
      $hasHeader={hasHeader}
    >
      {hasPhoto && backgroundPhoto && (
        <>
          <StyledPhotoLayer
            $src={backgroundPhoto.src}
            $position={backgroundPhoto.position ?? 'center'}
          />
          <StyledPhotoOverlay />
        </>
      )}
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
