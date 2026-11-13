import { css, styled } from 'styled-components';
import { StyledDividerSmall } from '@/src/components/ui/DividerSmall.styles';
import { COLORS } from '@/src/constants/styles';

/** Rule between the title and the text of a block, without vertical margin. */
export const StyledMultipleCTADivider = styled(StyledDividerSmall)`
  margin-top: 0 !important;
  margin-bottom: 0 !important;
`;

const flex = css`
  display: flex;
`;

/** One block: picture, number, title, text and button, centered. */
export const StyledMultipleCTAItem = styled.div`
  ${flex}
  flex-direction: column;
  align-items: center;
`;

export const StyledMultipleCTAPicture = styled.div`
  ${flex}
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 10px !important;
`;

export const StyledMultipleCTABody = styled.div`
  ${flex}
  flex: 1;
`;

export const StyledMultipleCTANumber = styled.div`
  font-weight: 700;
  color: ${COLORS.primaryBlue} !important;
  margin-top: 10px !important;
  margin-right: 40px !important;
`;

export const StyledMultipleCTAContent = styled.div`
  ${flex}
  flex-direction: column;
  flex: 1;
`;

export const StyledMultipleCTATitle = styled.h4<{
  $left: boolean;
  $hasPicture: boolean;
}>`
  ${flex}
  flex: 1;
  font-weight: 700;
  text-align: ${({ $left }) => ($left ? 'left' : 'center')} !important;
  justify-content: ${({ $left }) => ($left ? 'flex-start' : 'center')};
  align-items: ${({ $hasPicture }) => ($hasPicture ? 'center' : 'flex-start')};
`;

export const StyledMultipleCTAText = styled.div<{
  $hasButton: boolean;
  $spaced: boolean;
  $centered: boolean;
}>`
  flex: 1;
  margin-bottom: ${({ $hasButton }) => ($hasButton ? 10 : 0)}px !important;
  ${({ $spaced }) =>
    $spaced &&
    css`
      margin-top: 40px !important;
    `}
  ${({ $centered }) =>
    $centered &&
    css`
      text-align: center !important;
    `}
`;

export const StyledMultipleCTAButtons = styled.div<{ $left: boolean }>`
  ${flex}
  align-items: center;
  justify-content: ${({ $left }) => ($left ? 'flex-start' : 'center')};
  margin-top: 10px !important;
`;
