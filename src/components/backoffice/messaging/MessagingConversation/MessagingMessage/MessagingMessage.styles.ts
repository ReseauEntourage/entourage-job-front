import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const MessageContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  * {
    margin: 0;
  }
  p.message-date {
    font-size: 12px;
    color: ${COLORS.darkGray};
  }
  &.own-message {
    padding-left: 100px;
    p.message-date {
      text-align: right;
    }
  }
  &:not(.own-message) {
    padding-right: 100px;
    p.message-date {
      text-align: left;
    }
  }
`;

export const StyledMessage = styled.div`
  /* Bubble */
  border-radius: 10px;
  padding: 14px;
  box-sizing: border-box;

  /* Text */
  font-size: 12px;
  font-weight: 400;
  color: ${COLORS.black};
  white-space: pre-line;

  &.own-message {
    background: ${COLORS.lightgray};
  }
  &:not(.own-message) {
    background: ${COLORS.hoverBlue};
  }
`;
