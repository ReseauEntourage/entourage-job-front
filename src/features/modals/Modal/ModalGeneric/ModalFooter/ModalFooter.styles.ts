import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const StyledModalFooter = styled.div<{
  $layout: 'centered' | 'spread';
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: ${({ $layout }) =>
    $layout === 'spread' ? 'space-between' : 'center'};

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
`;
