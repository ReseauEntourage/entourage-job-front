import styled from 'styled-components';

export const StyledContainerWithTextCentered = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const StyledContainerMarginY = styled.div<{ marginTop?: string }>`
  margin-top: ${({ margin }) => margin || '40px'};
`;
