import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const ListContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  position: relative;
  flex: 2;
  @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const ListItem = styled.div`
  border: 1px solid ${COLORS.primaryOrange};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Scroll = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`;
