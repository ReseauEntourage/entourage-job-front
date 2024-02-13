import React, { useEffect, useState } from 'react'
import { StyledSuccessNotification, StyledFailedNotification, NOTIF_WIDTH } from './Notification.styles';
import { Check, Close } from 'assets/icons/icons';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import { notificationsActions } from 'src/use-cases/notifications';
import { useDispatch } from 'react-redux';
import { Transition } from 'react-transition-group';
import { useRef } from 'react';

export interface NotificationProps {
    id: string;
    type: 'success' | 'danger';
    message: string;
}

export const Notification = ({
    id,
    type,
    message,
}: NotificationProps) => {

  const dispatch = useDispatch();

  const handleNotification = async () => {
    await asyncTimeout(100);
    setInProp(true);
    await asyncTimeout(3000);
    setInProp(false);
    await asyncTimeout(500);
    dispatch(notificationsActions.removeNotification({id}))
  }


  useEffect(() => {
    handleNotification()
  }, [dispatch, id])

  const duration = 500;

  const defaultStyle = {
    transition: `${duration}ms ease-in-out`,
    transform: `translateX(${NOTIF_WIDTH})`,
    opacity:0
  }

  const transitionStyles = {
    entering: { transform:  `translateX(0)`, opacity:1 },
    entered: { transform:  `translateX(0)`, opacity:1 },
    exiting: { transform:  `translateX(${NOTIF_WIDTH})` , opacity:0},
    exited: { transform:  `translateX(${NOTIF_WIDTH})` , opacity:0},
  }

  const nodeRef = useRef(null);
  const [ inProp, setInProp ] = useState(false);

  return (<Transition 
    in={inProp} 
    nodeRef={nodeRef} 
    timeout={duration}
    >
    {(state) => 
    type === 'success' ?
        <StyledSuccessNotification 
          nodeRef={nodeRef}
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
          >
              <Check />
              {message}
        </StyledSuccessNotification>
      :
        <StyledFailedNotification 
          nodeRef={nodeRef}
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
          >
            <Close />
            {message}
        </StyledFailedNotification>
    }
  </Transition>)
}
