import styled from 'styled-components';

export const StyledCardListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const StyledCardList = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(272px, 1fr));
  gap: ${({ condensed }) => (condensed ? '20px' : '55px')};
  padding: 0;
`;

export const StyledCardListSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;
