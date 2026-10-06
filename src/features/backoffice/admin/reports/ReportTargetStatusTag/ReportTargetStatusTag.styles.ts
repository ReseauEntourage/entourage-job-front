import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledReportTargetStatus = styled.span<{ $isPending: boolean }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
  background-color: ${({ $isPending }) =>
    $isPending ? COLORS.lightYellow : COLORS.hoverBlue};
  color: ${({ $isPending }) => ($isPending ? COLORS.amber : COLORS.darkTeal)};
`;
