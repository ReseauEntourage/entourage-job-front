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
`;
