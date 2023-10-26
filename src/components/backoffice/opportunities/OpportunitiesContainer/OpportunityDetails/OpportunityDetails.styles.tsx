import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from 'src/constants/styles';

export const StyledOpportunityDetailsVariableHeightContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: ${HEIGHTS.HEADER + HEIGHTS.TABS_HEIGHT + HEIGHTS.SECTION_PADDING}px;
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    top: ${HEIGHTS.HEADER_MOBILE + HEIGHTS.SECTION_PADDING_MOBILE}px;
  }
`;

export const StyledScroll = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`;

export const StyledOpportunityDetailsTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px 5px 0 0;
  background-color: ${COLORS.white};
  padding: 16px;
  flex-wrap: wrap;
`;

export const StyledOpportunityDetailsCTAContainer = styled.div`
  background-color: ${COLORS.white};
  border-radius: 0 0 5px 5px;
  padding: 12px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2px;
`;

export const StyledOpportunityDetailsTitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StyledOpportunityDetailsContentContainer = styled.div`
  position: relative;
  min-height: 200px;
`;

export const StyledOpportunityDetailsInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
`;

export const StyledOpportunityDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 5px;
  background-color: ${COLORS.lightgray};
`;

export const StyledOpportunityDetailsDetailsContentContainer = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 5px;
  background-color: ${COLORS.white};
  overflow: auto;
  overscroll-behavior: contain;
  height: ${({ height }) => {
    return height ? `${height}px` : '100%';
  }};

  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    height: 100%;
  }
`;

export const StyledOpportunityDetailsRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

export const StyledOpportunityCTAsContainer = styled.ul`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  padding-left: 0;
  margin-bottom: 0;
  li {
    list-style: none;
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
    li:not(:last-child) {
      margin-bottom: 16px;
    }
  }
`;
