import styled from 'styled-components';
import { BREAKPOINTS, STATUS_COLORS } from 'src/constants/styles';

export const NOTIF_WIDTH = '450px';

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
  // Just over the onboarding modal
  z-index: 1051;

  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    top: unset;
    right: 20px;
    left: 20px;
    bottom: 20px;
  }
`;

export const StyledNotification = styled.div`
  background-color: ${(props) => {
    return backgroundColor[props.type];
  }};
  gap: 10px;
  display: flex;
  width: ${NOTIF_WIDTH};
  color: white;
  border-radius: 5px 0 0 5px;
  padding: 10px;

  @media screen and (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
    border-radius: 5px;
  }
`;

export const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
