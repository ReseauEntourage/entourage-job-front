import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDashboardCVCreationStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

export const StyledDashboardCVCreationStepSubtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
`;

export const StyledDashboardCVCreationStepContent = styled.div`
  width: 700px;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  margin: 30px 0;
  svg {
    min-width: 140px;
    height: 140px;
    width: 140px;
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
  color: ${COLORS.primaryOrange};
  span {
    font-weight: 400;
    font-size: 14px;
    font-style: italic;
    line-height: 21px;
  }
`;
