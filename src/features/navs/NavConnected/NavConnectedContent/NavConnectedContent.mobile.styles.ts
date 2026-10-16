import { styled } from 'styled-components';
import { StyledMobileMenuPanel } from '../../NavMobileMenu';

// The connected card spans the bar width, padding included
export const StyledConnectedMobilePanel = styled(StyledMobileMenuPanel)`
  box-sizing: border-box;
`;

export const StyledMobileBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 8px;
`;

export const StyledMobileAccountName = styled.span`
  font-weight: 600;
`;
