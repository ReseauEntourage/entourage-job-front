import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledListContainer = styled.div`
  overflow: hidden;
  position: relative;
  flex: 4;
  @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const StyledLinkCard = styled.a``;

export const StyledListItem = styled.div`
  border: 1px solid
    ${({ isSelected }) => {
      return isSelected ? COLORS.primaryOrange : COLORS.lightgray;
    }};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 14px;
`;

export const StyledListItemContainer = styled.div`
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;

export const StyledListContent = styled.div`
  height: 100%;
  position: relative;
`;
