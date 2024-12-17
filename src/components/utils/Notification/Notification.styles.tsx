import styled from 'styled-components';
import { BREAKPOINTS, STATUS_COLORS } from 'src/constants/styles';

export const NOTIF_WIDTH = '500px';

export const StyledNotificationWrapper = styled.div``;

const backgroundColor = {
  success: STATUS_COLORS.success,
  danger: STATUS_COLORS.error,
};

export const StyledNotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  top: 143px;
  position: fixed;
  right: 0;
  z-index: 100;
  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const StyledNotification = styled.div`
  background-color: ${(props) => {
    return backgroundColor[props.type];
  }};
  display: flex;
  width: ${NOTIF_WIDTH};
  color: white;
  border-radius: 5px 0 0 5px;
  padding: 10px 10px 10px 0;

  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
  }
`;

export const StyledIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  flex: 0 0 25px;
`;

export const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
