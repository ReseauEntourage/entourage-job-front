import styled from 'styled-components';
import { COLORS } from '../../../../constants/styles';

export const StyledSelectContainer = styled.div`
  width: 400px;
  max-width: 100%;
  .select {
    width: 100%;
    border: none;
    position: relative;
    .placeholder,
    .selected-value {
      padding: 4px 0;
      font-size: 14px;
      line-height: 17px;
      border: 0.5px solid white;
      border-bottom: solid 2px ${COLORS.gray};
      background-color: transparent;
      text-align: left;
      width: 100%;
      &:hover {
        cursor: pointer;
      }
    }
    .placeholder {
      color: ${COLORS.darkGray};
      font-style: italic;
      label {
        &:hover {
          cursor: pointer;
        }
      }
    }

    ul.options-container {
      width: 400px;
      max-width: 100%;
      margin: 0;
      padding: 0;
      border: 1px solid #f4f3f3;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      position: absolute;
      max-height: 175px;
      overflow-y: scroll;
      left: 0;
      li.option {
        list-style: none;
        margin: 0;
        padding: 0;
        button {
          width: 100%;
          background-color: white;
          border: 0.5px solid white;
          border-bottom: 1px solid #f4f3f3;
          text-align: left;
          font-size: 14px;
          line-height: 17px;
          padding: 16px 12px;
          transition: 0.2s ease-in-out;
          &:hover {
            border: 0.5px solid ${COLORS.primaryOrange};
            color: ${COLORS.primaryOrange};
            cursor: pointer;
          }
        }
      }
    }
  }
`;
