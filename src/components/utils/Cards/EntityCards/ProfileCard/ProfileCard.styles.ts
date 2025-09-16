import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfileCardPictureContainer = styled.div`
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  margin-top: -1px;
`;

export const StyledProfileCardPicture = styled.div`
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  height: 225px;
`;

export const StyledProfileCardInfoContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  position: absolute;
  bottom: 24px;
`;

export const StyledProfileCardAvailability = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 10px;
  right: 10px;
`;

export const StyledProfileCardName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;

  > * {
    line-height: 36px;
    font-size: 22px !important;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 0;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

export const StyledProfileCardDepartment = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;

  > * {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-left: 16px;
    padding-right: 16px;
    color: ${COLORS.white} !important;
  }
}
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

  > * {
    line-height: 24px;
    margin-bottom: 0;
    font-style: italic;
  }
`;
export const StyledProfileCardJobContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;

  > * {
    line-height: 24px;
    margin-bottom: 0;
    font-size: 18px !important;

    &:not(:first-child) {
      margin-top: 4px;
    }
  }
`;

export const StyledProfileCardLabel = styled.div`
  margin-bottom: 12px;
`;

export const StyledSeparator = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
  border-bottom: 1px solid ${COLORS.lightGray};
`;

export const StyledProfileCardBusinessSectors = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const StyledProfileCardNudgeContainer = styled.div``;

export const StyledProfileCardNudges = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export const StyledProfileCardNudge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledProfileCardNudgeLabel = styled.div`
  font-size: 8px;
  color: ${COLORS.mediumGray};
`;

export const StyledProfileCardEmptyBusinessSectorsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const StyledProfileCardEmptyNudgesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: 8px;
  margin-right: 8px;
`;

export const StyledProfileCardEmptyIcon = styled.div`
  width: 55px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledCTAContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;
