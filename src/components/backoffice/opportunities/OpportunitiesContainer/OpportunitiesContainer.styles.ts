import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
`;

export const StyledDetailsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

export const StyledRightContainer = styled.div`
  flex: 5;
  padding-left: 20px;
`;

export const StyledTitleText = styled.span`
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
  color: ${COLORS.mediumGray};

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RightAlignText = styled.span`
  text-align: right;
  display: flex;
  justify-content: flex-end;
`;

export const DescriptionText = styled.span`
  font-size: 14px;
  line-height: 17px;
  color: ${COLORS.black};
`;
