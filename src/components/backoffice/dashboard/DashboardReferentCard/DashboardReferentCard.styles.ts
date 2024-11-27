import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDashboardReferentPicture = styled.div`
  border-radius: 50%;
  overflow: hidden;
  width: 100px;
  height: 100px;
  position: relative;
  margin-bottom: 16px;
`;

export const StyledDashboardReferentName = styled.div`
  text-align: center;

  > * {
    margin-bottom: 0;
  }
`;

export const StyledDashboardReferentRole = styled.div`
  text-align: center;
`;
export const StyledDashboardReferentMail = styled.div`
  text-align: center;
  margin-top: 20px;
  a {
    color: ${COLORS.black};
    text-decoration: underline;
  }
`;

export const StyledDashboardReferentText = styled.div`
  text-align: center;
  margin-top: 20px;
`;
