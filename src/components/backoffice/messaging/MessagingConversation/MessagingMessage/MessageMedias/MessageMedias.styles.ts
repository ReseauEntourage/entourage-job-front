import styled from 'styled-components';

export const StyledMessageMedias = styled.div`
  display: flex;
`;

export const StyledMessageMediasGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 14px;
`;
