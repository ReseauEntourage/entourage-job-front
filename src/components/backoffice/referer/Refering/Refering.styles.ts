import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledReferingPage = styled.div`
  background: ${COLORS.lightGray};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledReferingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 795px;

  margin-top: 20px;
  margin-bottom: 20px;
  padding: 0 20px;
  box-sizing: border-box;
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    margin-top: 50px;
    margin-bottom: 15px;
    padding: 0 15px;
  }
`;

export const StyledReferingSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

export const StyledReferingSubtitle = styled.div`
  margin-bottom: 32px;
`;

export const StyledReferingListItem = styled.div`
  display: flex;
  align-items: center;

  :not(:last-child) {
    margin-bottom: 32px;
  }
`;

export const StyledReferingListItemLabels = styled.div`
  display: flex;
  flex-direction: column;

  h6 {
    margin-bottom: 10px;
  }
`;

export const StyledReferingListItemIcon = styled.div`
  min-width: 80px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledReferingButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-top: 32px;
`;
