import styled from 'styled-components';

export const StyledRecruitmentMetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

export const StyledMetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 90px;
`;
