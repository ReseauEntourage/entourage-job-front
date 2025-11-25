import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Card, LucidIcon, Text } from '@/src/components/utils';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  StyledActionContainer,
  StyledInvitationToActionContainer,
} from './EventInvitationToAction.styles';

export interface EventInvitationToActionProps {
  name: string;
  salesForceId: string;
  description?: string;
}

export const EventInvitationToAction = ({
  name,
  salesForceId,
  description,
}: EventInvitationToActionProps) => {
  const dispatch = useDispatch();
  const onShare = useCallback(() => {
    const canShare = !!navigator.share;

    const url = `${window.location.origin}/backoffice/events/${salesForceId}`;
    if (canShare) {
      navigator.share({
        title: name,
        text: description || 'Vous êtes invité à un événement',
        url,
      });
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(url);
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: "Le lien vers l'événement a été copié",
        })
      );
    }
  }, [description, dispatch, name, salesForceId]);

  return (
    <Card bgColor="extraDarkBlue">
      <StyledInvitationToActionContainer>
        <Text color="white" size="xlarge" weight="semibold" center>
          Souhaitez vous participez à l&apos;événement ?
        </Text>
        <StyledActionContainer>
          <Button>Participer à l&apos;événement</Button>
          <Button onClick={onShare}>
            <LucidIcon name="Share" />
            &nbsp;Partager l&apos;événement
          </Button>
        </StyledActionContainer>
      </StyledInvitationToActionContainer>
    </Card>
  );
};
