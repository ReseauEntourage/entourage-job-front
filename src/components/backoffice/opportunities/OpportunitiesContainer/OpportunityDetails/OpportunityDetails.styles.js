import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from 'src/constants/styles';

export const Container = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: ${HEIGHTS.HEADER + HEIGHTS.TABS_HEIGHT + HEIGHTS.SECTION_PADDING}px;
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    top: ${HEIGHTS.HEADER_MOBILE +
    HEIGHTS.TABS_HEIGHT_MOBILE +
    HEIGHTS.SECTION_PADDING_MOBILE}px;
  }
`;

export const Scroll = styled.div`
  height: 100%;
  position: relative;
  overflow: auto;
`;

export const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 5px;
  background-color: ${COLORS.white};
  padding: 20px;
`;

export const TitleContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ContentContainer = styled.div`
  position: relative;
  min-height: 200px;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
`;

export const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px;
  border-radius: 5px;
  background-color: ${COLORS.lightgray};
`;

export const DetailsContentContainer = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 5px;
  background-color: ${COLORS.white};
  overflow: auto;
  height: ${({ height }) => {
    return height;
  }}px;
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;
