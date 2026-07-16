import styled from 'styled-components';
import { Color, COLORS } from '@/src/constants/styles';

export type SidePanelVariant = 'white' | 'lightGray' | 'blue-gradient';

export const VARIANT_STYLES: Record<
  SidePanelVariant,
  { background: string; titleColor: Color }
> = {
  white: { background: COLORS.white, titleColor: 'black' },
  lightGray: { background: COLORS.lightGray, titleColor: 'black' },
  'blue-gradient': {
    background: `linear-gradient(135deg, ${COLORS.shadowDarkBlue1}, ${COLORS.shadowDarkBlue2})`,
    titleColor: 'white',
  },
};

// Base gradient shown behind a backgroundPhoto (loading/failure fallback) — distinct from
// VARIANT_STYLES['blue-gradient'].background, which stays unchanged for the no-photo case.
export const PHOTO_BASE_GRADIENT = `linear-gradient(155deg, ${COLORS.photoGradientBlue1} 0%, ${COLORS.photoGradientBlue2} 45%, ${COLORS.photoGradientBlue3} 100%)`;

const PHOTO_OVERLAY_GRADIENT = `linear-gradient(180deg, ${COLORS.photoOverlayBlue1} 0%, ${COLORS.photoOverlayBlue2} 38%, ${COLORS.photoOverlayBlue3} 72%, ${COLORS.photoGradientBlue3} 100%)`;

export const StyledRoot = styled.div<{
  $background: string;
  $hasHeader: boolean;
}>`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: ${({ $hasHeader }) => ($hasHeader ? '24px 0' : '0')};
  background: ${({ $background }) => $background};
`;

export const StyledPhotoLayer = styled.div<{ $src: string; $position: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: ${({ $position }) => $position};
`;

export const StyledPhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: ${PHOTO_OVERLAY_GRADIENT};
`;

export const StyledHeader = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
  padding: 0 24px;
`;

export const StyledSeparator = styled.hr`
  border: none;
  border-top: 1px solid ${COLORS.gray};
  margin: 16px 0;
  flex-shrink: 0;
`;

export const StyledContent = styled.div<{
  $align: 'start' | 'center';
  $hasHeader: boolean;
}>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: ${({ $align }) =>
    $align === 'center' ? 'center' : 'flex-start'};
  flex: 1;
  min-height: 0;
  padding: ${({ $hasHeader }) => ($hasHeader ? '0 24px' : '0')};
`;
