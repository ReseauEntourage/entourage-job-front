import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledHeader = styled.div`
  background-color: ${COLORS.white};
`;

export const StyledHeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  gap: 30px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    margin-top: 10px;
    gap: 15px;
  }
`;

export const StyledHeaderPictureContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const StyledHeaderInfoContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
`;

export const StyledEventInfoElementContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

export const StyledEventInfoElement = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;
