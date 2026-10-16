import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledCollapsible = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2px;
  list-style: none;
`;

export const StyledCollapsibleToggle = styled.button<{
  $active: boolean;
  $minHeight: number;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-height: ${({ $minHeight }) => $minHeight}px;
  padding: 0 16px;
  border: 0;
  border-radius: 20px;
  background-color: ${({ $active }) =>
    $active ? COLORS.hoverBlue : 'transparent'};
  color: ${({ $active }) => ($active ? COLORS.darkTeal : COLORS.black)};
  font-family: Poppins, sans-serif;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:hover {
    background-color: ${COLORS.hoverBlue};
  }
`;

export const StyledCollapsibleHeader = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const StyledCollapsibleChevron = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledCollapsibleContent = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
`;
