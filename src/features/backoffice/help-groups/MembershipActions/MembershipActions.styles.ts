import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledMembershipActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

// « ⋯ » next to the group name, below the desktop breakpoint
export const StyledMembershipMenuToggle = styled.button`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid ${COLORS.gray};
  border-radius: 50%;
  background-color: ${COLORS.white};
  color: ${COLORS.black};
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background-color: ${COLORS.lightGray};
  }
`;

export const StyledLeaveMenuItem = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${COLORS.warning};
`;
