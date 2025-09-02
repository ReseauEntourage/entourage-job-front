import styled from 'styled-components';

export const StyledCompanyLeftColumn = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  flex: 2;
  gap: 40px;
  &.mobile {
    min-width: unset;
    width: 100%;
    margin-bottom: 40px;
  }
`;

export const StyledCompanyRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 40px;
  min-width: 400px;
  &.mobile {
    min-width: unset;
    width: 100%;
  }
`;
