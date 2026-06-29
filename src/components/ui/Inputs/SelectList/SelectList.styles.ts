import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';
import { commonInputContainerStyles } from '../Inputs.styles';
import { SelectListVariant } from './SelectList';

export const StyledSelectListContainer = styled.div<{ disabled?: boolean }>`
  ${() => commonInputContainerStyles}
`;

const getSelectListVariantStyles = (variant?: SelectListVariant) => {
  switch (variant) {
    case 'inline':
      return `
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;

        > button {
          width: auto;
        }
      `;
    case 'grid':
      return `
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));

        @media (max-width: ${BREAKPOINTS.desktop}px) {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
      `;
    default:
      return `
        display: flex;
        flex-direction: column;
        align-items: stretch;
      `;
  }
};

export const StyledSelectList = styled.div<{ $variant?: SelectListVariant }>`
  ${(props) => getSelectListVariantStyles(props.$variant)}

  padding: 0;
  margin-bottom: 8px;
  gap: 16px;
`;

export const StyledButton = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
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

export const StyledSelectListGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StyledSelectListGroupLabel = styled.div``;
