import styled from 'styled-components';

export const StyledInputsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
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
