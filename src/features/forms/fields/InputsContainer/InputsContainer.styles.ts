import styled from 'styled-components';
import { BREAKPOINTS } from 'src/constants/styles';

export const StyledInputsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .field-container {
    flex: 1;
    width: 100%;
    :not(:last-child) {
      margin-bottom: 18px;
    }
  }
  .field-container-no-width {
    flex: 0;
  }
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: row;
    .field-container {
      width: auto;
      :not(:last-child) {
        margin-bottom: 0;
        margin-right: 36px;
      }
    }
  }
`;
