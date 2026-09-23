import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledCloseButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${COLORS.lightGray};
  }
`;

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
  margin-bottom: 10px;
`;

export const StyledHeaderModalTop = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
`;

export const StyledHeaderModalTitleContainer = styled.div<{
  $align: 'center' | 'left';
}>`
  flex: 1;
  display: flex;
  justify-content: ${({ $align }) =>
    $align === 'left' ? 'flex-start' : 'center'};
`;

export const StyledModalContent = styled.div`
  height: auto;
  /* Lets the body yield height to the header and footer, then scroll. */
  flex: 1 1 auto;
  min-height: 0;
  max-height: 100%;
  overflow-y: auto;

  padding: 0 50px;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 0 20px;
  }
`;
