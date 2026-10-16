import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export type ModalFooterLayout = 'centered' | 'spread' | 'end';

export const StyledModalFooter = styled.div<{
  $layout: ModalFooterLayout;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: ${({ $layout }) =>
    ({ centered: 'center', spread: 'space-between', end: 'flex-end' })[
      $layout
    ]};

  ${({ $layout }) =>
    $layout === 'spread'
      ? `
  /* Footer sits below the scrolling body, so it carries its own gutters. */
  flex-shrink: 0;
  box-sizing: border-box;
  gap: 20px;
  padding: 20px 50px 0 50px;
  border-top: 1px solid ${COLORS.lightGray};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    flex-direction: column-reverse;
    align-items: stretch;
    padding: 16px 20px 0 20px;
  }
`
      : ''}

  ${({ $layout }) =>
    $layout === 'end'
      ? `
  /* Footer sits below the scrolling body, so it carries its own gutters. */
  flex-shrink: 0;
  box-sizing: border-box;
  gap: 12px;
  padding: 20px 50px 0 50px;
  border-top: 1px solid ${COLORS.lightGray};

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    gap: 8px;
    padding: 16px 16px 0 16px;

    > * {
      flex: 1;
    }

    > *:last-child {
      flex: 2;
    }
  }
`
      : ''}
`;
