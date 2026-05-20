import React from 'react';
import { Card, LucidIcon, Text } from '@/src/components/ui';
import { ButtonAddToCalendar } from '@/src/components/ui/Button/ButtonAddToCalendar';
import { ButtonShare } from '@/src/components/ui/Button/ButtonShare';
import { EventParticipateButton } from '../EventParticipateButton/EventParticipateButton';
import { EventMode } from 'src/constants/events';
import {
  StyledActionContainer,
  StyledInvitationToActionContainer,
} from './EventInvitationToAction.styles';

interface EventInvitationToActionProps {
  name: string;
  salesForceId: string;
  description?: string;
  isParticipating: boolean;
  startDate: string;
  endDate: string;
  mode: EventMode;
  meetingLink: string | null;
  fullAddress: string | null;
}

export const EventInvitationToAction = ({
  name,
  salesForceId,
  description,
  isParticipating,
  startDate,
  endDate,
  mode,
  meetingLink,
  fullAddress,
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
          {isParticipating && (
            <ButtonAddToCalendar
              title={name}
              description={description ?? ''}
              startDate={startDate}
              endDate={endDate}
              mode={mode}
              meetingLink={meetingLink}
              fullAddress={fullAddress}
              variant="default"
            >
              <LucidIcon name="CalendarPlus" />
              &nbsp;Ajouter à mon agenda
            </ButtonAddToCalendar>
          )}
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
