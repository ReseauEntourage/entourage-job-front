import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

/**
 * Actions at the bottom of the body of a modal, under a thin rule and aligned on the
 * right. The top margin is given in px.
 */
export const StyledModalActions = styled.div<{ $marginTop: number }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 15px 0 0;
  border-top: 1px solid ${COLORS.lightRule};
  background-color: transparent;
  margin-top: ${({ $marginTop }) => $marginTop}px !important;

  > :last-child {
    margin-bottom: 0;
  }
`;
