import styled from 'styled-components';

export const StyledSelectOptionTitle = styled.div<{
  $flexDirection?: 'row' | 'column';
}>`
  display: flex;
  gap: 20px;
  flex-direction: ${({ $flexDirection }) => $flexDirection || 'row'};
  font-family: Poppins, sans-serif;
  padding: 20px;
  align-items: flex-start;
`;
