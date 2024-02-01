import styled from 'styled-components';

export const StyledDashboardProfileCardPictureName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  margin: 20px;
  h5 {
    margin-bottom: 0;
  }
  p {
    margin: 0;
  }
`;

export const StyledDashboardProfileCardDescription = styled.div`
  margin: 20px;
  font-weight: 300;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
`;

export const StyledDashboardProfileCardHelps = styled.div`
  margin: 0 20px 20px 20px;
`;

export const StyledDashboardProfileCardhelpsTitle = styled.div`
  width: 100%;
  padding-bottom: 15px;
  border-bottom: 1px solid #feeae3;
  margin-bottom: 30px;
  font-size: 16px;
`;

export const StyledDashboardProfileCardHelpList = styled.div`
  > div {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

export const StyledDashboardCTAContainer = styled.div`
  margin: 0 20px 20px 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
