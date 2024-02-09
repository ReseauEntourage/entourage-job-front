import React, { useEffect, useState } from 'react'
import { StyledSuccessNotification, StyledFailedNotification } from './Notification.styles';
import { Check, Close } from 'assets/icons/icons';

export interface NotificationProps {
    type: 'success' | 'danger';
    message: string;
}

export const Notification = ({
    type,
    message,
}: NotificationProps) => {

  const [hasTranslated, setHasTranslated] = useState(false)
  useEffect(() => {
      setHasTranslated(true)
  }, [])

    if (type === 'success') {
      return (
        <StyledSuccessNotification hasTranslated={hasTranslated}>
            <Check />
              {message}
        </StyledSuccessNotification>
        )
    } else {
     return  (
      <StyledFailedNotification hasTranslated={hasTranslated}>
        <Close />
        {message}
      </StyledFailedNotification>
      )
    }
}
