import styled from 'styled-components';

export const StyledSelectOptionTitleIconDescriptionLabel = styled.div<{
  $flexDirection?: 'row' | 'column';
}>`
  display: flex;
  gap: 20px;
  flex-direction: ${({ $flexDirection }) => $flexDirection || 'row'};
  font-family: Poppins, sans-serif;
  padding: 20px;
  align-items: flex-start;
`;

export const StyledIconContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  > svg {
    height: 55px;
    width: 55px;
  }
`;

export const StyledTitleDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  text-align: left;
`;
