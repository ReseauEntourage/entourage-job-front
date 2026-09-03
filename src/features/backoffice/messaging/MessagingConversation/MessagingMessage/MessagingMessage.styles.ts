import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 5px;
  width: 100%;
  * {
    margin: 0;
  }
  p.message-date {
    font-size: 12px;
    color: ${COLORS.mediumGray};
  }
  &.own-message {
    padding-left: 150px;
    @media (max-width: ${BREAKPOINTS.desktop}px) {
      padding-left: 80px;
    }
    p.message-date {
      text-align: right;
    }
  }
  &:not(.own-message) {
    padding-right: 150px;
    @media (max-width: ${BREAKPOINTS.desktop}px) {
      padding-right: 80px;
    }
    p.message-date {
      text-align: left;
    }
  }
  &.service-message {
    align-items: center;
    padding-left: 60px;
    padding-right: 60px;
    @media (max-width: ${BREAKPOINTS.desktop}px) {
      padding-left: 20px;
      padding-right: 20px;
    }
    p.message-date {
      text-align: center;
    }
  }
`;

export const StyledMessage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
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
    background: ${COLORS.lightGray};
  }
  &:not(.own-message) {
    background: ${COLORS.hoverBlue};
  }
`;

export const StyledServiceMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;
  padding: 10px 16px;
  box-sizing: border-box;
  background: ${COLORS.lightYellow};
  text-align: center;
  white-space: pre-line;
`;

export const StyledServiceMessageQuote = styled.div`
  border-left: 2px solid ${COLORS.mediumGray};
  padding: 4px 12px;
  font-style: italic;
`;

export const StyledWarning = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;

  a {
    color: ${COLORS.lightRed};
    text-decoration: underline;
  }
`;
