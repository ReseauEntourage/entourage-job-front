import styled from 'styled-components';

/**
 * General Messaging Styles
 */
export const StyledMessagingGridDesktop = styled.div`
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
  width: 100%;
`;

export const StyledMessagingGridMobile = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

export const StyledMessagingLeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 430px;
  max-width: 400px;
`;

export const StyledMessagingRightPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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
  p {
    margin: 0;
    text-align: center;
  }
`;
