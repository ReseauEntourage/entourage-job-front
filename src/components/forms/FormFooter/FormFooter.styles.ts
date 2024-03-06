import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledFooterForm = styled.div`
  display: flex;
  flex-direction: column;
  .cta-container {
    padding-top: 24px;
    // max-width: 440px;
    display: block;
    margin: 0 auto;

    > div {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;

      button:last-child:not(:only-child) {
        margin-left: 20px;
      }
    }
  }
`;

export const StyledErrorMessage = styled.div`
  flex: 1;
  color: ${COLORS.warningOrange};
  font-size: 14px;
  margin-bottom: 16px;
`;

export const StyledCompulsoryMessage = styled.div`
  color: ${COLORS.darkGrayFont};
  font-size: 12px;
`;
