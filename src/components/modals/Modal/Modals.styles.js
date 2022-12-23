import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledHeaderModal = styled.div`
  .title-container {
    width: 100%;
    border-bottom: 1px solid ${COLORS.primaryOrange};
    h3 {
      width: 100%;
      text-align: center;
      padding: 20px 24px;
      box-sizing: border-box;
      margin-bottom: 0;
    }
  }
  .description-container {
    padding: 20px 0;
    text-align: center;
    > div {
      max-width: 440px;
      display: block;
      margin: auto;
      p {
        margin-bottom: 0px;
      }
      span {
        color: ${COLORS.darkGray};
      }
    }
  }
`;
