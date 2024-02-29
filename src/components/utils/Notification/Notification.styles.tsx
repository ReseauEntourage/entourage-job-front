import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const NOTIF_WIDTH = '600px';

export const StyledNotificationWrapper = styled.div``;

export const StyledNotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: ${NOTIF_WIDTH};
  height: 50px;
  top: 143px;
  position: fixed;
  right: 0;
  z-index: 100;
`;

const StyledNotification = styled.div`
  box-sizing: border-box;
  width: ${NOTIF_WIDTH};
  color: white;
  height: 50px;
  line-height: 50px;
  padding-left: 20px;
  border-radius: 5px 0 0 5px;
  svg {
    margin-right: 20px;
    height: 25px;
  }
`;

export const StyledSuccessNotification = styled(StyledNotification)`
  background-color: ${COLORS.yesGreen};
`;

export const StyledFailedNotification = styled(StyledNotification)`
  background-color: ${COLORS.noRed};
`;
