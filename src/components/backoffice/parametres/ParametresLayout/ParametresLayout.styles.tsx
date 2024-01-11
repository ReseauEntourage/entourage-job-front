import styled from 'styled-components';

export const StyledParametresLayout = styled.div`
  background-color: #f3f3f3;
`;

export const StyledParametresGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
  width: 100%;
  &.mobile {
    margin-top: 30px;
    flex-direction: column;
    gap: 0;
  }
`;

export const StyledParametresLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 40px;
  min-width: 400px;
  &.mobile {
    min-width: unset;
    width: 100%;
    margin-bottom: 40px;
  }
`;

export const StyledParametresRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  gap: 40px;
  &.mobile {
    width: 100%;
  }
`;
