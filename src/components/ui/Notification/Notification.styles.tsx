import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, STATUS_COLORS } from '@/src/constants/styles';

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

export const StyledNotification = styled.div<{
  type: 'success' | 'danger';
}>`
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

/** Duration of the fade of a toast, in ms. */
export const TOAST_FADE_MS = 200;

/** Toasts: stacked at the top center of the page, full width on small screens. */
export const StyledToastsContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  z-index: 1060;
  box-sizing: border-box;
  width: 350px;
  margin-left: -175px;

  @media (max-width: 639px) {
    left: 10px;
    right: 10px;
    width: auto;
    margin: 0;
  }
`;

export const StyledToast = styled.div<{
  $type: 'success' | 'danger';
  $visible: boolean;
}>`
  position: relative;
  padding: 15px;
  background: ${COLORS.sectionMuted};
  color: ${({ $type }) =>
    $type === 'danger' ? COLORS.danger : STATUS_COLORS.success};
  font-size: 1.25rem;
  line-height: 1.4;
  cursor: pointer;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity ${TOAST_FADE_MS}ms linear;

  * + & {
    margin-top: 10px;
  }
`;
