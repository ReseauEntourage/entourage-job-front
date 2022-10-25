import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledCoachTestimony = styled.div`
  background-color: ${COLORS.wheat};
  border-top: 2px solid ${COLORS.primaryOrange};
  border-bottom: 2px solid ${COLORS.primaryOrange};
  .testimony-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    .testimony-content {
      display: flex;
      flex-direction: column;
      width: 25%;
      min-width: 350px;
      margin-bottom: 24px;
      .quote {
        font-weight: 700;
        line-height: 20px;
        border-bottom: 1px solid ${COLORS.gray};
        padding-bottom: 8px;
        margin-bottom: 16px;
        @media screen and (min-width: ${BREAKPOINTS.desktop}px) {
          min-height: 80px;
        }
        span {
          color: ${COLORS.primaryOrange};
        }
      }
      .names {
        span {
          color: ${COLORS.darkGray};
          font-style: italic;
        }
      }
    }
  }
`;
