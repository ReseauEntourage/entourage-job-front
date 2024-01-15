import styled from 'styled-components';

export const StyledProfileLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  gap: 40px;
  min-width: 400px;
  &.mobile {
    min-width: unset;
    width: 100%;
    margin-bottom: 40px;
  }
`;

export const StyledProfileRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 40px;
  &.mobile {
    width: 100%;
  }
`;
