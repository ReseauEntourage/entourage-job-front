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

export const StyledSkeletonAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${COLORS.extraLightGray};
`;

export const StyledSkeletonLine = styled.div<{ width?: string }>`
  width: ${({ width }) => width ?? '100%'};
  height: 10px;
  border-radius: 4px;
  background: ${COLORS.extraLightGray};
`;

export const StyledSkeletonTag = styled.div<{ width?: string }>`
  width: ${({ width }) => width ?? '56px'};
  height: 20px;
  border-radius: 10px;
  background: ${COLORS.extraLightGray};
`;

export const StyledSkeletonCTA = styled.div`
  width: 96px;
  height: 28px;
  border-radius: 8px;
  background: ${COLORS.lightGray};
`;
