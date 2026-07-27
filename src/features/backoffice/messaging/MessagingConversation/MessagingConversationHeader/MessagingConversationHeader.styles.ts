import styled from 'styled-components';
import { BREAKPOINTS, COLORS } from 'src/constants/styles';

export const MessagingConversationHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 21px;
  border-bottom: 1px solid ${COLORS.lightGray};
  background: ${COLORS.white};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    border-bottom: 1px solid ${COLORS.gray};
    background: ${COLORS.lightGray};
    align-items: stretch;
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    padding: 0;
  }
`;

export const MessagingConversationHeaderMainInfos = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  box-sizing: border-box;
  font-size: 14px;
  align-items: center;
  gap: 12px;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 5px 0;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  * {
    margin: 0;
  }
`;

export const AddreseeSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AddreseeInfosContainer = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
  align-items: center;
`;

export const ConversationAddresee = styled.div`
  display: flex;
  align-items: flex-start;
  flex: auto;
  flex-direction: column;
`;

export const AddreseeBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  @media (max-width: ${BREAKPOINTS.desktop}px) {
    padding: 10px;
    border-top: 1px solid ${COLORS.gray};
  }
`;
