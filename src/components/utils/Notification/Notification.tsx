import React, { useCallback, useEffect, useState } from 'react'
import { StyledSuccessNotification, StyledFailedNotification } from './Notification.styles';
import { Check, Close } from 'assets/icons/icons';
import { asyncTimeout } from 'src/utils/asyncTimeout';
import { notificationsActions } from 'src/use-cases/notifications';
import { useDispatch } from 'react-redux';
import { usePrevious } from 'src/hooks/utils';

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

  const [hasTranslated, setHasTranslated] = useState(false);
  const prevHasTranslated = usePrevious(hasTranslated);
  const dispatch = useDispatch();

  useEffect(() => {
    setHasTranslated(true);
  }, [])

  
  useEffect(() => {
    const handleNotification = async () => {
      await asyncTimeout(3000);
      setHasTranslated(false);
      // await asyncTimeout(500);
      // dispatch(notificationsActions.removeNotification({id}))
    }
    if (hasTranslated) {
      handleNotification()
    }
  }, [hasTranslated])


  useEffect(() => {
    const handleNotification = async () => {
      // await asyncTimeout(3000);
      // setHasTranslated(false);
      await asyncTimeout(500);
      dispatch(notificationsActions.removeNotification({id}))
    }
    if (!hasTranslated && prevHasTranslated) {
      handleNotification()
    }
  }, [hasTranslated, id, dispatch])

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
