import styled from 'styled-components';
import { COLORS, HEIGHTS } from 'src/constants/styles';

/**
 * General Messaging Styles
 */
export const StyledMessagingGridDesktop = styled.div`
  display: flex;
  flex-direction: row;
  height: calc(100vh - ${HEIGHTS.HEADER}px);
  flex: 1;
  border-top: ${HEIGHTS.MESSAGING_DESKTOP_BORDER_SIZE}px solid
    ${COLORS.lightgray};
  box-sizing: border-box;
`;

export const StyledMessagingGridMobile = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: calc(100vh - ${HEIGHTS.HEADER_MOBILE}px);
`;

export const StyledMessagingLeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 430px;
  max-width: 430px;
  border-right: ${HEIGHTS.MESSAGING_DESKTOP_BORDER_SIZE}px solid
    ${COLORS.lightgray};
`;

export const StyledMessagingRightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
`;

export const StyledMessagingConversationContainerMobile = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

/**
 * Empty state styles
 */
export const MessagingEmptyStateContainerDesktop = styled.div`
  flex: 1;
  height: calc(100vh - ${HEIGHTS.HEADER}px);
  padding: 20px 50px;
`;

export const MessagingEmptyStateContainerMobile = styled.div`
  padding: 20px 50px;
`;

export const MessagingEmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 20px;
  h3 {
    margin: 0;
  }
  p {
    margin: 0;
    text-align: center;
  }
`;
