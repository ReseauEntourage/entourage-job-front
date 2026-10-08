import { styled, css } from 'styled-components';
import { ReportTargetType } from '@/src/api/types';
import { SimpleLink } from '@/src/components/ui';
import { COLORS, SHADOWS } from '@/src/constants/styles';

// The whole card is the link to the target page
export const StyledReportTargetCard = styled(SimpleLink)<{
  $isMobile?: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  padding: 18px 24px;
  border-radius: 8px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
  color: ${COLORS.black};
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: ${COLORS.black};
    text-decoration: none;
    box-shadow: ${SHADOWS.raised};
  }

  ${({ $isMobile }) =>
    $isMobile &&
    css`
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      padding: 14px 16px;
    `}
`;

const TYPE_COLORS: {
  [K in ReportTargetType]: { background: string; color: string };
} = {
  CONVERSATION: { background: COLORS.extraLightPurple, color: COLORS.purple },
  USER_PROFILE: { background: COLORS.extraLightAmber, color: COLORS.amber },
  POST: { background: COLORS.extraLightTeal, color: COLORS.teal },
  POST_REPLY: { background: COLORS.extraLightTeal, color: COLORS.teal },
};

const typeColors = ({ $targetType }: { $targetType: ReportTargetType }) => css`
  background-color: ${TYPE_COLORS[$targetType].background};
  color: ${TYPE_COLORS[$targetType].color};
`;

export const StyledReportTargetTypeIcon = styled.span<{
  $targetType: ReportTargetType;
}>`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  ${typeColors}
`;

export const StyledReportTargetTypeTag = styled.span<{
  $targetType: ReportTargetType;
}>`
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  ${typeColors}
`;

export const StyledReportTargetMain = styled.div`
  display: flex;
  flex: 1 1 360px;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const StyledReportTargetLabel = styled.div`
  min-width: 0;

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const StyledReportTargetReasons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const StyledReportTargetLast = styled.div`
  display: flex;
  flex: 0 0 160px;
  flex-direction: column;
  gap: 2px;
`;

export const StyledReportTargetStatus = styled.div`
  display: flex;
  flex: 0 0 150px;
  justify-content: flex-end;
`;

export const StyledReportTargetMobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;
