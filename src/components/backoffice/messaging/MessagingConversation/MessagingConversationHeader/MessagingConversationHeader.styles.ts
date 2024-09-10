import styled from 'styled-components';
import { COLORS, HEIGHTS } from 'src/constants/styles';

export const MessagingConversationHeaderContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 17px 21px;
  border-bottom: 1px solid ${COLORS.lightgray};
  box-sizing: border-box;
  font-size: 14px;
  align-items: center;

  a.report-link {
    color: ${COLORS.darkGray};
  }
  &.mobile {
    background: ${COLORS.white};
    position: sticky;
    top: ${HEIGHTS.HEADER_MOBILE}px;
    left: 0;
    right: 0;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
  * {
    margin: 0;
  }
`;

export const AddreseeInfosContainer = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
`;

export const ConversationAddresee = styled.div`
  display: flex;
  flex: auto;
  flex-direction: column;
  .addresee-name {
    font-weight: 700;
    font-size: 16px;
  }
`;
