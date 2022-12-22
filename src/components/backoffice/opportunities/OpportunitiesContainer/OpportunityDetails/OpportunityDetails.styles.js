import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from 'src/constants/styles';

export const StyledContainer = styled.div`
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

export const StyledTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px 5px 0 0;
  background-color: ${COLORS.white};
  padding: 16px;
  flex-wrap: wrap;
`;

export const StyledCTAContainer = styled.div`
  background-color: ${COLORS.white};
  border-radius: 0 0 5px 5px;
  padding: 12px 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2px;
`;

export const StyledTitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 80%;
`;

export const StyledContentContainer = styled.div`
  position: relative;
  min-height: 200px;
`;

export const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
  width: 20%;
`;

export const StyledDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 5px;
  background-color: ${COLORS.lightgray};
`;

export const StyledDetailsContentContainer = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 5px;
  background-color: ${COLORS.white};
  overflow: auto;
  height: ${({ height }) => {
    return height ? `${height}px` : '100%';
  }};

  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    height: 100%;
  }
`;

export const StyledActionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;
