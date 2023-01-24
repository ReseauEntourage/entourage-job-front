import AsyncSelect from 'react-select/async';
import styled from 'styled-components';
import { COLORS } from '../../../../constants/styles';

export const StyledAsyncSelect = styled(AsyncSelect)`
  .react-select__control {
    min-width: 300px;
    width: 100%;
    max-width: 100%;
    border: 0.5px solid white;
    border-bottom: solid 2px #d9d9d9;
    margin-bottom: 18px;
    max-height: 28.5px;
    min-height: unset;
    border-radius: 0;
    .react-select__value-container {
      padding-left: 0;
      .react-select__placeholder {
        margin-left: 0;
        font-size: 14px;
        font-style: italic;
        line-height: 17px;
        padding-bottom: 4px;
        color: ${COLORS.darkGray};
      }
    }
    .react-select__indicators {
      .react-select__indicator-separator {
        display: none;
      }
      .react-select__indicator {
        padding: 0;
        svg {
          height: 18px;
          width: 18px;
          color: ${COLORS.primaryOrange};
        }
      }
    }
    &:hover {
      border: 0.5px solid white;
      border-bottom: solid 2px #d9d9d9;
    }
  }
  .react-select__control--is-focused {
    /* border: none; */
    box-shadow: none;
  }
  .react-select__menu {
    margin: none;
    border-radius: 0;
    top: 55%;
  }
`;
