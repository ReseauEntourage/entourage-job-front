import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StyledCollaboratorSmallCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 16px;
`;

export const StyledCtaContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const StyledEmptyContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  padding-bottom: 20px;
`;

export const StyledIlluContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  flex-shrink: 0;
`;
