import { styled } from 'styled-components';

export const StyledReportFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;

  > * {
    flex: 1 1 200px;
    max-width: 280px;
  }
`;

export const StyledReportLoadMore = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;
