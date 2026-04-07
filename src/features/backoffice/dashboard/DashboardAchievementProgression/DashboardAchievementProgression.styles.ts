import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

type BadgeStatus = 'not_started' | 'in_progress' | 'obtained';

const ICON_CIRCLE_COLOR: Record<BadgeStatus, string> = {
  not_started: COLORS.lightGray,
  in_progress: COLORS.lightYellow,
  obtained: COLORS.darkBlue,
};

export const StyledAchievementCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  width: 100%;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column;
  }
`;

export const StyledAchievementLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  min-width: 200px;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    min-width: unset;
    width: 100%;
    justify-content: flex-start;
  }
`;

export const StyledTooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StyledIconCircle = styled.div<{ $status: BadgeStatus }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${({ $status }) => ICON_CIRCLE_COLOR[$status]};
  flex-shrink: 0;
`;

export const StyledAchievementTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StyledAchievementRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const StyledProgressRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StyledProgressRowHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const StyledProgressLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;
