import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledAlertContent = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    gap: 15px;
  }
`;
