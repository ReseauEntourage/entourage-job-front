import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const StyledModal = styled.div`
  background: ${COLORS.white};
  border-radius: 5px;
  margin: 15px;
  ${({ removePadding }) => (removePadding ? `padding: 0;` : 'padding: 20px;')}

  position: 'relative';

  // Default is full screen
  width: 100%;

  // On desktop, we can set a custom width
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    ${({ width }) => width && `width: ${width};`}
    padding: 80px;
  }
`;

export const StyledHeaderModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${COLORS.gray};
  margin-bottom: 40px;
`;

export const StyledModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    text-align: center;
  }
  button {
    margin: 20px 0;
  }
`;
