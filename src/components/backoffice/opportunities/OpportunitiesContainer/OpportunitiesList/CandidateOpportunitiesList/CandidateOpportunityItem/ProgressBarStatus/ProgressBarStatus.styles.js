import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  margin-bottom: 12px;
`;

export const StyledStep = styled.div`
  flex: 1;
  height: 2px;
  &:not(:last-child) {
    margin-right: 2px;
  }
  background-color: ${({ activate, color }) => {
    return activate ? COLORS[color] || COLORS.primaryOrange : COLORS.gray;
  }};
`;
