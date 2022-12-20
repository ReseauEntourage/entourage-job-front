import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
`;

export const DetailsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

export const RightContainer = styled.div`
  flex: 5;
  padding-left: 20px;
`;

export const BackLink = styled.a`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
  color: ${COLORS.darkGray};
  &:visited {
    color: ${COLORS.darkGray};
  }
`;

export const TitleText = styled.span`
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 8px;
  color: ${COLORS.black};
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SubtitleText = styled.span`
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 8px;
  color: ${COLORS.black};
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const InfoText = styled.span`
  font-size: 14px;
  line-height: 17px;
  color: ${COLORS.darkGray};
  &:not(:last-child) {
    margin-bottom: 4px;
  }
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DescriptionText = styled.span`
  font-size: 14px;
  line-height: 17px;
  color: ${COLORS.black};
`;
