import Link from 'next/link';
import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

/**
 * Link of the report pages, as in the validated design: blue, 12px, no
 * underline (`$isBold` for the actions, regular for the breadcrumb and the
 * references to the group and the discussion).
 */
export const ReportLink = styled(Link)<{ $isBold?: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  font-size: 12px;
  font-weight: ${({ $isBold = true }) => ($isBold ? 600 : 400)};
  color: ${COLORS.darkBlue};
  text-decoration: none;

  &:hover {
    color: ${COLORS.darkBlue};
    text-decoration: underline;
  }
`;
