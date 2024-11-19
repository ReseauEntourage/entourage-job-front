import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

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
  @media (min-width: ${BREAKPOINTS.desktop}px) {
    padding-bottom: 20px;
  }
`;

export const StyledDashboardCardContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 30px;
`;

export const StyledDashboardCardContent = styled.div`
  width: 100%;
`;

export const StyledDashboardCardSubtitle = styled.div`
  text-align: center;
`;

export const StyledDashboardArticlesContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(223px, 250px));
  gap: 20px;
  justify-content: center;
`;

export const StyledDashboardArticle = styled.div`
  border: ${COLORS.gray} 1px solid;
  border-radius: 20px;
  box-shadow: 0px 4px 4px 0px #00000008;
  &:hover {
    box-shadow: 0 8px 16px 0 ${COLORS.gray};
    cursor: pointer;
  }
`;

export const StyledDashboardArticleImage = styled.div`
  overflow: hidden;
  position: relative;
  height: 142px;
  border-radius: 20px 20px 0 0;
  margin-left: -1px;
  margin-right: -1px;
  margin-top: -1px;
`;

export const StyledDashboardArticleText = styled.div`
  margin-top: 20px;
  margin-bottom: 32px;
  padding: 0 10px;
  text-align: center;
`;
