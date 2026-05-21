import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import { commonInputStyles } from '../Inputs/Inputs.styles';

export const StyledWrapper = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px solid ${COLORS.gray};
  border-radius: 8px;
  overflow: hidden;
  &:hover {
    border-color: ${COLORS.darkGray};
  }
`;

export const StyledInput = styled.input`
  ${() => commonInputStyles}
  border: none;
  border-radius: 0;
  flex: 1;
  min-width: 0;
  cursor: default;
  &:hover,
  &:focus {
    border: none;
    outline: none;
  }
`;

export const StyledCopyButton = styled.button<{ $copied: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  background: ${({ $copied }) => ($copied ? COLORS.primaryBlue : '#f3f6f9')};
  border: none;
  border-left: 1px solid ${COLORS.gray};
  cursor: pointer;
  white-space: nowrap;
  font-family: Poppins, sans-serif;
  font-size: 13px;
  color: ${({ $copied }) => ($copied ? 'white' : COLORS.black)};
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ $copied }) => ($copied ? COLORS.primaryBlue : '#e8edf2')};
  }
`;
