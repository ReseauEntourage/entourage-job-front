import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 0;
`;

export const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
  padding: 0 24px;
`;

export const StyledSeparator = styled.hr`
  border: none;
  border-top: 1px solid ${COLORS.gray};
  margin: 16px 0;
  flex-shrink: 0;
`;

export const StyledContent = styled.div<{ $align: 'start' | 'center' }>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ $align }) =>
    $align === 'center' ? 'center' : 'flex-start'};
  flex: 1;
  min-height: 0;
  padding: 0 24px;
`;
