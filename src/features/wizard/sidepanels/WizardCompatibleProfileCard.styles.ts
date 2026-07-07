import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid ${COLORS.gray};
  color: ${COLORS.extraDarkGray};
  box-shadow: 0px 8px 24px 0px ${COLORS.darkBlue}1A;
`;

export const StyledCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const StyledCardInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledCardName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${COLORS.extraDarkGray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledCardJob = styled.span`
  font-size: 12px;
  color: ${COLORS.darkGray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StyledCardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

export const StyledCardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const StyledFullCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
`;

export const StyledFullSectorLine = styled.span`
  font-size: 13px;
  color: ${COLORS.darkGray};
`;

export const StyledFullSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledFullCTAWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledLockedButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${COLORS.darkGray};
  background: ${COLORS.lightGray};
  border: 1px solid ${COLORS.gray};
  border-radius: 20px;
  cursor: not-allowed;
  white-space: nowrap;
`;
