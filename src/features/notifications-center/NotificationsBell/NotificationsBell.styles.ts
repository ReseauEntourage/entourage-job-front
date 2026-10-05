import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledNotificationsBell = styled.div`
  position: relative;

  .pin-notification {
    position: absolute;
    top: 8px;
    right: 8px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background: ${COLORS.lightRed};
    border-radius: 9px;
    color: ${COLORS.white};
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
`;

export const StyledNotificationsPanel = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  width: 400px;
  max-height: 70vh;
  overflow-y: auto;
  background-color: ${COLORS.white};
  border: 1px solid ${COLORS.gray};
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
`;

export const StyledNotificationsPanelHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${COLORS.gray};
`;
