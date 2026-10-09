import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

// 44 px: comfortable touch target
export const StyledMessageMenuToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background-color: ${COLORS.transparent};
  border-radius: 50%;
  color: ${COLORS.darkGray};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: ${COLORS.lightGray};
  }
`;

export const StyledModerationItem = styled.span`
  color: ${COLORS.lightRed};
`;

export const StyledReportItem = styled.span`
  color: ${COLORS.warning};
`;
