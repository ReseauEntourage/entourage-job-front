import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDashboardStaffContactPicture = styled.div`
  border-radius: 50%;
  overflow: hidden;
  width: 100px;
  height: 100px;
  position: relative;
  margin-bottom: 16px;
`;

export const StyledDashboardStaffContactNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledDashboardStaffContactName = styled.div`
  text-align: center;

  > * {
    margin-bottom: 0;
  }
`;

export const StyledDashboardStaffContactRole = styled.div`
  text-align: center;
`;
export const StyledDashboardStaffContactMail = styled.div`
  text-align: center;
  a {
    color: ${COLORS.black};
    text-decoration: underline;
  }
`;

export const StyledDashboardStaffContactText = styled.div`
  text-align: center;
`;
