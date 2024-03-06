import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDashboardLinkedUserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledDashboardLinkedUserCardCTAContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

export const StyledDashboardLinkedUserNameContainer = styled.h3`
  color: ${COLORS.primaryBlue};
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  text-align: center;
  margin: 20px 0 5px;
`;

export const StyledDashboardLinkedUserCardCityContainer = styled.div`
  margin: 0 0 20px;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
`;

export const StyledDashboardLinkedUserCardContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  margin-bottom: 20px;
  > a {
    text-decoration: underline;
    color: ${COLORS.black};
  }
`;
