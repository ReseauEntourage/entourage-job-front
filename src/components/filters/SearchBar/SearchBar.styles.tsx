import styled from 'styled-components';
import { COLORS, HEIGHTS } from 'src/constants/styles';

export const StyledSearchBarContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledSearchBar = styled.div`
  height: 45px;
  border-radius: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  // keep this background for better visibility
  background-color: ${({ light }) => (light ? COLORS.white : COLORS.lightgray)};
  min-height: ${HEIGHTS.SEARCH_BAR_HEIGHT}px;
`;

export const StyledSearchBarInput = styled.input`
  box-sizing: border-box;
  margin: 0;
  border-radius: 0;
  font: inherit;
  overflow: visible;
  -webkit-appearance: none;
  vertical-align: middle;
  width: 100%;
  border: none;
  color: #363636;
  height: 40px;
  padding-left: 6px;
  padding-right: 6px;
  background: transparent;
  padding: 0 25px;
  &:focus {
    background-color: transparent;
    outline: none;
  }

  &:-ms-input-placeholder {
    color: #999 !important;
  }

  &::placeholder {
    color: #999;
  }
`;

export const StyledSearchBarSubmitButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background: ${COLORS.primaryBlue};
  color: ${COLORS.white};
  width: 55px;
  padding-right: 5px;
  border-radius: 0 23px 23px 0;
  svg {
    color: ${COLORS.white};
  }
`;
