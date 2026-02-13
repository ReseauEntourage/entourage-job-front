import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDashbardProfileCardSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 20px;
  padding: 0 20px;
`;

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

export const StyledDashboardProfileCardCompletionContainer = styled.div`
  margin: 0 20px;
`;

export const StyledDashboardProfileCardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const StyledDashboardProfileCardSectionTitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  border-bottom: 1px solid ${COLORS.gray};
  padding: 5px 0;
`;

export const StyledDashboardProfileCardIntroduction = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  white-space: normal;
`;

export const StyledDashboardProfileCardNudges = styled.div`
  margin: 20px 20px 30px 20px;
`;

export const StyledDashboardProfileCardNudgesTitle = styled.div`
  width: 100%;
  padding-bottom: 15px;
  border-bottom: 1px solid ${COLORS.hoverBlue};
  margin-bottom: 20px;
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

export const StyledDashboardProfileCardEmptyState = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;
