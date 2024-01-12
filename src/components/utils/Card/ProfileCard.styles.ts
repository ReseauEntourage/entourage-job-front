import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfileCard = styled.div`
  width: 300px;

  > * {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
`;

export const StyledProfileCardPictureContainer = styled.div`
  position: relative;
`;

export const StyledProfileCardPicture = styled.div`
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  height: 250px;
`;

export const StyledProfileCardInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  position: absolute;
  bottom: 36px;
  text-shadow: 2px 2px 5px ${COLORS.black};
  width: 100%;
`;

export const StyledProfileCardName = styled.div`
  display: flex;
  flex-direction: row;
  text-overflow: ellipsis;
  overflow: hidden;
  padding-left: 16px;

  > h2 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 0;
    line-height: 28px;
  }
`;

export const StyledProfileCardDepartment = styled.div`
  color: ${COLORS.white};
  margin-left: 8px;
  padding-right: 16px;
  flex-wrap: nowrap;
  white-space: nowrap;
`;

export const StyledProfileCardRole = styled.div`
  position: absolute;
  left: 16px;
  bottom: -14px;
`;

export const StyledProfileCardContent = styled.div`
  padding: 24px 16px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const StyledProfileCardProfessionalSituation = styled.div`
  flex: 1;
`;

export const StyledProfileCardEmptyJobContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  > h4 {
    line-height: 24px;
    margin-bottom: 0;
    font-style: italic;
  }
`;
export const StyledProfileCardJobContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  > h3 {
    line-height: 24px;
    margin-bottom: 0;

    &:not(:first-child) {
      margin-top: 4px;
    }
  }
`;

export const StyledProfileCardLabel = styled.div`
  margin-bottom: 12px;
  font-size: 16px;
  color: ${COLORS.darkGrayFont};
`;

export const StyledSeparator = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
  border-bottom: 1px solid ${COLORS.lightgray};
`;

export const StyledProfileCardBusinessLines = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledProfileCardHelpContainer = styled.div``;

export const StyledProfileCardHelps = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
`;

export const StyledProfileCardHelp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledProfileCardHelpLabel = styled.div`
  font-size: 12px;
  color: ${COLORS.darkGray};
`;

export const StyledProfileCardEmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const StyledProfileCardEmptyIcon = styled.div`
  width: 55px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledProfileCardEmptyLabel = styled.div`
  flex: 1;
  font-size: 14px;
  font-style: italic;
  color: ${COLORS.darkGray};
`;
