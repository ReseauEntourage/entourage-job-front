import styled from 'styled-components';
import { Button } from 'src/components/utils/Button';
import { COLORS } from 'src/constants/styles';

export const ResetFilterButton = styled(Button)`
  background: transparent !important;
  border: none;
  font-weight: bold;
  text-decoration: underline;
  color: ${COLORS.black};

  &:hover,
  &:focus {
    background: transparent;
    color: ${COLORS.black};
    text-decoration: underline;
  }
`;

export const StyledFiltersOptions = styled.div`
  .reset-filters-button {
    color: ${COLORS.black} !important;
    border: none !important;
    text-decoration: underline !important;
    cursor: pointer;
    font-weight: 400 !important;
    border-color: ${COLORS.primaryBlue} !important;
    background-color: transparent !important;

    &:hover {
      color: ${COLORS.black} !important;
      border: none !important;
      text-decoration: underline !important;
      cursor: pointer;
      font-weight: 400 !important;
      border-color: ${COLORS.primaryBlue} !important;
      background-color: transparent !important;
    }
  }
`;
