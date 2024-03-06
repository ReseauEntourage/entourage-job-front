import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDashboardCVCreationStepContent = styled.div`
  max-width: 700px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  svg {
    min-width: 140px;
  }
`;

export const StyledDashboardCVCreationStepContentText = styled.div`
  padding: 15px 0;
  p {
    font-size: 14px;
    margin: 0;
  }
`;

export const StyledDashboardCVCreationStepCandidateName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  color: ${COLORS.primaryBlue};
  span {
    font-weight: 400;
    font-size: 14px;
    font-style: italic;
    line-height: 21px;
  }
`;
