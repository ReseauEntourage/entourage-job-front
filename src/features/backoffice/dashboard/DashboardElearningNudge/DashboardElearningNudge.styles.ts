import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledElearningNudge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  width: 100%;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const StyledElearningNudgeIconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${COLORS.hoverBlue};
  flex-shrink: 0;
`;

export const StyledElearningNudgeContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

export const StyledElearningNudgeFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    align-items: center;
    width: 100%;
  }
`;
