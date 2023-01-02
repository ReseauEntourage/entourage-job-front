import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

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
`;
