import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledHelpGroupBackLink = styled.nav`
  display: flex;
  min-width: 0;

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 100%;
    min-height: 32px;
    color: ${COLORS.darkBlue};
    font-size: 13px;
    text-decoration: none;
  }

  a:hover {
    color: ${COLORS.extraDarkBlue};
    text-decoration: underline;
  }

  svg {
    flex: none;
  }
`;

// A long group name is truncated visually only, the link keeps it whole
export const StyledHelpGroupBackLinkLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
