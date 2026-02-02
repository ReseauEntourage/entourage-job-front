import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledFiltersOptions = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;

  .reset-filters-button {
    color: ${COLORS.black} !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    text-decoration: underline !important;
    cursor: pointer;
    font-weight: 400 !important;
    background-color: transparent !important;
    padding: 0 !important;

    &:hover,
    &:focus,
    &:active {
      color: ${COLORS.black} !important;
      text-decoration: underline !important;
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      background-color: transparent !important;
    }
  }
`;
