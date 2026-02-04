import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';
import { commonInputContainerStyles } from '../Inputs.styles';

export const StyledSelectListContainer = styled.div<{ disabled?: boolean }>`
  ${() => commonInputContainerStyles}
`;

export const StyledSelectList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  margin-bottom: 8px;
  gap: 16px;
`;

export const StyledButton = styled.button<{ $selected?: boolean }>`
  width: 100%;
  position: relative;
  border: 1px solid ${COLORS.gray};
  background-color: ${COLORS.white};
  border-radius: 20px;
  padding: 0;
  ${({ $selected }) =>
    $selected &&
    `
    border: 1px solid ${COLORS.primaryBlue};
    background-color: ${COLORS.hoverBlue};
  `}

  &:hover {
    cursor: pointer;
  }
`;

export const StyledCheckIconContainer = styled.div<{ $selected?: boolean }>`
  display: none;
  ${({ $selected }) =>
    $selected &&
    `
    position: absolute;
    right: -8px;
    top: -8px;
    background-color: ${COLORS.primaryBlue};
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 25px;
  `}
`;

export const StyledListOptionContainer = styled.div`
  display: flex;
  align-items: stretch;
`;

export const StyledInput = styled.input<{ radioSize?: 'small' | 'large' }>`
  width: ${(props) => (props.radioSize === 'small' ? '16px' : '20px')};
  height: ${(props) => (props.radioSize === 'small' ? '16px' : '20px')};
`;

export const StyledSelectListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${COLORS.gray};
  border-radius: 16px;
  cursor: pointer;
  background-color: ${COLORS.white};

  &:hover {
    background-color: ${COLORS.hoverBlue};
  }
`;
