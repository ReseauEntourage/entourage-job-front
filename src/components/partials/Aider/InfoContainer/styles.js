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
    @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
      padding: 0 60px;
    }
    margin: 0 auto 48px;
    text-align: center;
    .orange {
      color: ${COLORS.primaryOrange};
      font-size: 16px;
      line-height: 20px;
    }
    .strong {
      font-weight: 700;
      line-height: 32px;
      @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
        font-size: 20px;
        line-height: 24px;
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
      .picto-h4 {
        display: flex;
        flex-direction: row;
        align-items: center;
        svg {
          min-width: 43px;
          height: 43px;
          margin-right: 10px;
        }
        h4 {
          font-weight: 700;
          margin: 16px 0;
        }
        li {
          margin-bottom: 16px;
        }
      }
    }
  }
`;
