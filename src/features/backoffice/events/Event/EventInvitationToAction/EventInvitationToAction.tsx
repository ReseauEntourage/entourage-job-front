import React from 'react';
import { Card, LucidIcon, Text } from '@/src/components/ui';
import { ButtonShare } from '@/src/components/ui/Button/ButtonShare';
import { EventParticipateButton } from '../EventParticipateButton/EventParticipateButton';
import {
  StyledActionContainer,
  StyledInvitationToActionContainer,
} from './EventInvitationToAction.styles';

export interface EventInvitationToActionProps {
  name: string;
  salesForceId: string;
  description?: string;
  isParticipating: boolean;
}

export const EventInvitationToAction = ({
  name,
  salesForceId,
  description,
  isParticipating,
}: EventInvitationToActionProps) => {
  return (
    <Card>
      <StyledInvitationToActionContainer>
        <Text size="xlarge" weight="semibold" center>
          Souhaitez-vous participer à l&apos;événement ?
        </Text>
        <StyledActionContainer>
          <EventParticipateButton
            eventSalesForceId={salesForceId}
            isParticipating={isParticipating}
          />
          <ButtonShare
            url={`${window.location.origin}/backoffice/events/${salesForceId}`}
            title={name}
            description={description}
            variant="default"
          >
            <LucidIcon name="Share" />
            &nbsp;Partager l&apos;événement
          </ButtonShare>
        </StyledActionContainer>
      </StyledInvitationToActionContainer>
    </Card>
  );
};
