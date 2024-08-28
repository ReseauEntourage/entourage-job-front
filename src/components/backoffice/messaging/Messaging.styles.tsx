import styled from 'styled-components';

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
  min-width: 400px;
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
