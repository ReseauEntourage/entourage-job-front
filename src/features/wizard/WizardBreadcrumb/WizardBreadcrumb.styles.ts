import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledBreadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 24px;
`;

export const StyledStep = styled.div<{ status: 'active' | 'done' | 'future' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: ${({ status }) => (status === 'active' ? 600 : 400)};
  color: ${({ status }) => {
    if (status === 'active') return COLORS.primaryBlue;
    if (status === 'done') return '#22c55e';
    return COLORS.mediumGray;
  }};
`;

export const StyledStepDot = styled.div<{ status: 'active' | 'done' | 'future' }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background-color: ${({ status }) => {
    if (status === 'active') return COLORS.primaryBlue;
    if (status === 'done') return '#22c55e';
    return COLORS.lightGray;
  }};
  color: ${({ status }) =>
    status === 'future' ? COLORS.mediumGray : COLORS.white};
  flex-shrink: 0;
`;

export const StyledDivider = styled.div`
  flex: 1;
  height: 1px;
  background-color: ${COLORS.gray};
  margin: 0 8px;
  max-width: 40px;
`;
