import styled from 'styled-components';

export const StyledCVEditButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 20px;
  row-gap: 20px;
  flex-wrap: wrap;
  &.mobile {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
  }
`;

export const StyledCVEditStatusVersion = styled.div``;

export const StyledCVNav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;
