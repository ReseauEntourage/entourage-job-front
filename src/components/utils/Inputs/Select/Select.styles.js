import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledSelectContainer = styled.div`
  min-width: 300px;
  width: 100%;
  max-width: 100%;
  .label-top {
    font-size: 14px;
    padding: 4px 0;
    display: inline-block;
    line-height: 17px;
    font-family: Poppins, sans-serif;
  }
  .select {
    width: 100%;
    border: none;
    position: relative;
    margin-bottom: 30px;
    .placeholder,
    .selected-value {
      font-family: Poppins, Arial, sans-serif;
      padding: 4px 0;
      font-size: 14px;
      line-height: 17px;
      border: 0.5px solid white;
      border-bottom: solid 2px ${COLORS.gray};
      background-color: transparent;
      text-align: left;
      width: 100%;
      min-height: 30px;
      &:hover {
        cursor: pointer;
      }
      span {
        float: right;
        height: 18px;
        width: 18px;
        color: ${COLORS.primaryOrange};
      }
    }
    .placeholder {
      color: ${COLORS.darkGray};
      font-style: italic;
      font-family: Poppins, sans-serif !important;
      label {
        &:hover {
          cursor: pointer;
        }
      }
    }

    ul.options-container {
      min-width: 300px;
      width: 100%;
      z-index: 100;
      max-width: 100%;
      margin: 0;
      padding: 0;
      border: 1px solid #f4f3f3;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
          font-family: Poppins, sans-serif !important;
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
