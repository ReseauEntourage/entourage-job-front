import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledHeaderModal = styled.div`
  padding: 0 50px;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 20px;
  }
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 14px;
  // border-bottom: 1px solid ${COLORS.gray};
  margin-bottom: 40px;
`;

export const StyledHeaderModalTop = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
`;

export const StyledHeaderModalTitleContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

export const StyledModalContent = styled.div`
  height: auto;
  max-height: 100%;
  overflow-y: auto;

  padding: 0 50px;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 20px;
  }
`;
