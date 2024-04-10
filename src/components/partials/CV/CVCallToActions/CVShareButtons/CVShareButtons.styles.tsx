import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCVShareButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  gap: 20px;
`;

export const StyledCVShareBUtton = styled.div`
  border: 1px solid ${COLORS.primaryBlue};
  border-radius: 500px;
  display: block;
  padding: 7px;
  svg {
    fill: ${COLORS.primaryBlue};
    height: 25px;
    width: 25px;
  }
  &:hover {
    background-color: ${COLORS.primaryBlue};
    cursor: pointer;
    svg {
      color: white;
      fill: white;
    }
  }
`;
