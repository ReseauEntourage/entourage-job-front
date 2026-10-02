import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledHelpGroupAdminActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const StyledHelpGroupAdminState = styled.span<{ $isPublished: boolean }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
  background-color: ${({ $isPublished }) =>
    $isPublished ? COLORS.hoverBlue : COLORS.lightYellow};
  color: ${({ $isPublished }) => ($isPublished ? COLORS.darkTeal : COLORS.amber)};
`;

export const StyledHelpGroupAdminMobileLine = styled.div``;
