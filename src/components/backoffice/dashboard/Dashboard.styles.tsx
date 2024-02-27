import styled from 'styled-components';

export const StyledDashboardLeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 40px;
  min-width: 400px;
  max-width: 400px;
  &.mobile {
    min-width: 100%;
    max-width: 100%;
    margin-bottom: 40px;
  }
`;

export const StyledDashboardRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  gap: 40px;
  &.mobile {
    width: 100%;
  }
`;

export const StyledDashboardTitleContainer = styled.div`
  padding-bottom: 20px;
`;