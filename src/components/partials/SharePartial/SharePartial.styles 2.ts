import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledShareButton = styled.button`
  height: 32px;
  width: 32px;
  background-color: ${COLORS.primaryOrange};
  border-radius: 90px;
  border: 1px solid ${COLORS.primaryOrange};
  padding: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease-in-out;
  svg {
    max-height: 100%;
    max-width: 100%;
    path {
      transition: 0.2s ease-in-out;
      fill: white;
    }
  }
  &:hover {
    background-color: white;
    cursor: pointer;
    svg path {
      fill: ${COLORS.primaryOrange};
    }
  }
`;
