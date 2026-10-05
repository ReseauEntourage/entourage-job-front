import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledMessageMenuToggle = styled.button`
  display: inline-flex;
  padding: 4px;
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
