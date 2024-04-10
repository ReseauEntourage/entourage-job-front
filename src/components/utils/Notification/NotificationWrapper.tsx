import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Transition } from 'react-transition-group';
import { notificationsActions } from 'src/use-cases/notifications';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import { Notification } from './Notification';
import { NOTIF_WIDTH, StyledNotificationWrapper } from './Notification.styles';

export interface NotificationWrapperProps {
  id: string;
  type: 'success' | 'danger';
  message: string;
}

export const NotificationWrapper = ({
  id,
  type,
  message,
}: NotificationWrapperProps) => {
  const dispatch = useDispatch();
  const [inProp, setInProp] = useState(false);

  const handleNotification = useCallback(async () => {
    await asyncTimeout(100);
    setInProp(true);
    await asyncTimeout(3000);
    setInProp(false);
    await asyncTimeout(500);
    dispatch(notificationsActions.removeNotification({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    handleNotification();
  }, [dispatch, id, handleNotification]);

  const duration = 500;

  const defaultStyle = {
    transition: `${duration}ms ease-in-out`,
    transform: `translateX(${NOTIF_WIDTH})`,
    opacity: 0,
  };

  const transitionStyles = {
    entering: { transform: `translateX(0)`, opacity: 1 },
    entered: { transform: `translateX(0)`, opacity: 1 },
    exiting: { transform: `translateX(${NOTIF_WIDTH})`, opacity: 0 },
    exited: { transform: `translateX(${NOTIF_WIDTH})`, opacity: 0 },
  };

  const nodeRef = useRef(null);

  return (
    <Transition in={inProp} nodeRef={nodeRef} timeout={duration}>
      {(state) => (
        <StyledNotificationWrapper
          nodeRef={nodeRef}
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          <Notification type={type} message={message} />
        </StyledNotificationWrapper>
      )}
    </Transition>
  );
};
