import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledFooterForm = styled.div`
  .cta-container {
    padding-top: 24px;
    max-width: 440px;
    display: block;
    margin: 0 auto;
    > div {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      button:last-child {
        margin-left: 20px;
      }
    }
  }
`;

export const StyledFormHeading = styled.div`
  width: 100%;
  font-size: 16px;
  margin: 28px 0 24px;
  padding-bottom: 4px;
  border-bottom: 1px solid ${COLORS.primaryOrange};
  @media screen and (max-width: ${BREAKPOINTS.desktop - 1}px) {
    font-size: 14px;
  }
`;