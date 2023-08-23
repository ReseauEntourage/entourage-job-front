import styled from 'styled-components';
import { COLORS, BREAKPOINTS } from 'src/constants/styles';

export const StyledSendMailContent = styled.div`
  border: none;
  p {
    line-height: 24px;
  }
  .margin-right {
    margin-right: 8px;
  }
  .gray {
    color: ${COLORS.gray};
  }
  .textarea-container {
    padding: 12px;
    background-color: ${COLORS.white};
    border-radius: 5px;
    & textarea {
      margin-bottom: 0;
    }
  }
  .email-content {
    background-color: #f4f3f3;
    padding: 20px;
    border-radius: 5px;
    .email-headers,
    .email-details {
      background-color: ${COLORS.white};
      border-radius: 5px;
      > div {
        padding: 8px 12px;
        &:not(:last-child) {
          border-bottom: 1px solid ${COLORS.gray};
        }
      }
    }
    .email-details {
      padding: 12px;
      margin: 16px 0;
    }
  }
  @media screen and (max-width: ${BREAKPOINTS.desktop - 1}px) {
    font-size: 14px;
    .email-content {
      background-color: unset;
      padding: 0;
    }
    .email-details,
    .email-headers,
    .textarea-container {
      border: solid 1px ${COLORS.gray};
      border-radius: 5px;
    }
  }
`;
