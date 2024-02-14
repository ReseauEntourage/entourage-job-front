import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Transition } from 'react-transition-group';
import { Check, Close } from 'assets/icons/icons';
import { notificationsActions } from 'src/use-cases/notifications';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import {
  StyledSuccessNotification,
  StyledFailedNotification,
  NOTIF_WIDTH,
} from './Notification.styles';

export interface NotificationProps {
  id: string;
  type: 'success' | 'danger';
  message: string;
}

export const Notification = ({ id, type, message }: NotificationProps) => {
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
      {(state) =>
        type === 'success' ? (
          <StyledSuccessNotification
            nodeRef={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <Check />
            {message}
          </StyledSuccessNotification>
        ) : (
          <StyledFailedNotification
            nodeRef={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <Close />
            {message}
          </StyledFailedNotification>
        )
      }
    </Transition>
  );
};
