import styled from 'styled-components';

export const StyledInputsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: ${({ isDesktop }) => {
    return isDesktop ? 'inherit' : 'wrap';
  }};
  justify-content: space-between;
  .field-container {
    flex: 1;
    :not(:last-child) {
      margin-right: ${({ isDesktop }) => {
        return isDesktop ? '36px' : '0';
      }};
    }
  }
  .field-container-no-width {
    flex: 0;
  }
`;
