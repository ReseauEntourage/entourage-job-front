import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledMessageMenuToggle = styled.span`
  display: inline-flex;
  padding: 4px;
  border-radius: 50%;
  color: ${COLORS.darkGray};
  cursor: pointer;

  &:hover {
    background-color: ${COLORS.lightGray};
  }
`;

export const StyledModerationItem = styled.span`
  color: ${COLORS.lightRed};
`;
