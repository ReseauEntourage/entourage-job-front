import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledInfoContainer = styled.section`
  margin: 32px 0;
  .img-full-width-container {
    margin-top: 28px;
    width: 100%;
    > div {
      height: 160px;
      @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
        height: 280px;
      }
      max-width: 100%;
      margin: 0 auto;
      position: relative;
    }
  }
  .text-content {
    max-width: 1200px;
    margin: 0 auto 48px;
    text-align: center;
    line-height: 24px;
    font-size: 14px;
    .orange {
      color: ${COLORS.primaryOrange};
      font-weight: 700;
    }
    .strong {
      font-weight: 700;
    }
    @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
      padding: 0 60px;
      font-size: 16px;
      line-height: 32px;

      .strong {
        font-size: 20px;
      }
    }
  }
  .informer-cards-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: flex-start;

    .informer-card,
    .informer-illustration {
      width: 20%;
      min-width: 350px;
      margin-bottom: 28px;
    }

    .informer-illustration {
      margin-bottom: 58px;
      @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
        margin-right: 30px;
      }
      .informer-illustration-container {
        width: calc(100% - 30px);
        position: relative;
        &:after {
          content: '';
          height: 60px;
          width: 60px;
          background-color: ${COLORS.primaryOrange};
          bottom: -30px;
          right: -30px;
          position: absolute;
          border-radius: 5px;
        }
      }
    }

    .informer-card {
      font-size: 14px;
      padding-right: 0;
      box-sizing: border-box;
      .picto-h4 {
        display: flex;
        align-items: center;
        flex-direction: row;
        svg {
          min-width: 43px;
          height: 43px;
          margin-right: 10px;
        }
        h4 {
          font-weight: 700;
          margin: 16px 0;
          font-size: 14px;
        }
      }
      li {
        margin-bottom: 16px;
      }
      @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
        padding-right: 24px;
        .picto-h4 {
          display: unset;
        }
      }
    }
  }
`;
