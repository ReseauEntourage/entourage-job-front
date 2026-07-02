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

export const StyledRoot = styled.div<{
  $background: string;
  $hasHeader: boolean;
}>`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${({ $hasHeader }) => ($hasHeader ? '24px 0' : '0')};
  background: ${({ $background }) => $background};
`;

export const StyledHeader = styled.div`
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
  display: flex;
  flex-direction: column;
  justify-content: ${({ $align }) =>
    $align === 'center' ? 'center' : 'flex-start'};
  flex: 1;
  min-height: 0;
  padding: ${({ $hasHeader }) => ($hasHeader ? '0 24px' : '0')};
`;
