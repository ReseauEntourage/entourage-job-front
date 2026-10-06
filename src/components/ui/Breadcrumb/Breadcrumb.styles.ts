import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledBreadcrumb = styled.nav`
  width: 100%;
  min-width: 0;
`;

export const StyledBreadcrumbList = styled.ol`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  min-width: 0;
  color: ${COLORS.darkGray};
  font-size: 14px;
`;

export const StyledBreadcrumbItem = styled.li<{ $isLast: boolean }>`
  display: flex;
  align-items: center;
  min-width: 0;
  /* Only the current page shrinks: its title is visually truncated */
  flex-shrink: ${({ $isLast }) => ($isLast ? 1 : 0)};
  max-width: ${({ $isLast }) => ($isLast ? 'none' : '40%')};
`;

export const StyledBreadcrumbLabel = styled.span<{ $isLast: boolean }>`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ $isLast }) => ($isLast ? COLORS.black : COLORS.darkGray)};

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const StyledBreadcrumbSeparator = styled.span`
  flex-shrink: 0;
  margin: 0 8px;
`;
