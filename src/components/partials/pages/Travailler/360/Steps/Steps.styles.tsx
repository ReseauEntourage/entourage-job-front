import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledSteps = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 40px 100px;
  box-sizing: border-box;
  .cell {
    width: calc(50% - 1px);
    box-sizing: border-box;
    padding-bottom: 30px;
    .strong {
      font-weight: 700;
      position: relative;
      padding-bottom: 12px;
      margin-bottom: 12px;
      height: 23px;
      border-bottom: 0.5px solid ${COLORS.primaryBlue};
      &:after {
        position: absolute;
        height: 70px;
        width: 70px;
        border-radius: 70px;
        border: 0.5px solid ${COLORS.primaryBlue};
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
        font-weight: 700;
        color: ${COLORS.primaryBlue};
        font-size: 24px;
      }
    }
    &:nth-child(even) {
      border-left: 0.5px solid ${COLORS.gray};
      > div {
        padding-left: 80px;
      }
      .strong:after {
        left: -36px;
      }
    }
    &:nth-child(odd) {
      > div {
        padding-right: 80px;
      }
      .strong:after {
        right: -36px;
      }
    }
    &:nth-child(1) .strong:after {
      content: '1';
    }
    &:nth-child(4) .strong:after {
      content: '2';
    }
    &:nth-child(5) .strong:after {
      content: '3';
    }
    &:nth-child(8) .strong:after {
      content: '4';
    }
    &:last-child {
      border-left: none;
    }
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop - 1}px) {
    padding: 40px 0;
    .cell {
      width: 100%;
      padding-bottom: 50px;
      &.empty {
        display: none;
      }
      .strong {
        height: unset;
        &:after {
          top: unset;
          bottom: -26px;
          height: 50px;
          width: 50px;
        }
      }
      > div:not(.strong) {
        color: ${COLORS.darkGray};
      }
      &:nth-child(even) {
        border-left: none;
        > div {
          padding-left: 68px;
        }
        .strong:after {
          left: 0;
        }
      }
      &:nth-child(odd) {
        > div {
          padding-right: 68px;
        }
        .strong:after {
          right: 0;
        }
      }
    }
  }
`;
