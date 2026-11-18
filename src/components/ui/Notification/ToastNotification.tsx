import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { notificationsActions } from '@/src/use-cases/notifications';
import { asyncTimeout } from '@/src/utils/asyncTimeout';
import { StyledToast, TOAST_FADE_MS } from './Notification.styles';

/** How long a toast stays on screen, in ms. */
export const TOAST_DURATION_MS = 5000;

interface ToastNotificationProps {
  id: string;
  type: 'success' | 'danger';
  message: string;
}

/** Message shown at the top of the page, closed by a click or after a few seconds. */
export const ToastNotification = ({
  id,
  type,
  message,
}: ToastNotificationProps) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const remove = useCallback(async () => {
    setVisible(false);
    await asyncTimeout(TOAST_FADE_MS);
    dispatch(notificationsActions.removeNotification({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await asyncTimeout(0);
      if (cancelled) {
        return;
      }
      setVisible(true);
      await asyncTimeout(TOAST_DURATION_MS);
      if (!cancelled) {
        remove();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [remove]);

  return (
    <StyledToast
      $type={type}
      $visible={visible}
      role="alert"
      tabIndex={0}
      onClick={remove}
      onKeyDown={(event) => {
        if (['Enter', ' ', 'Escape'].includes(event.key)) {
          event.preventDefault();
          remove();
        }
      }}
    >
      {message}
    </StyledToast>
  );
};
