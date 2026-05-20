import React from 'react';
import { Card, LucidIcon, Text } from '@/src/components/ui';
import { ButtonAddToCalendar } from '@/src/components/ui/Button/ButtonAddToCalendar';
import { ButtonShare } from '@/src/components/ui/Button/ButtonShare';
import { EventParticipateButton } from '../EventParticipateButton/EventParticipateButton';
import { Event } from 'src/api/types';
import {
  StyledButtonsContainer,
  StyledContainer,
  StyledStatusBadge,
  StyledStatusContainer,
} from './EventActions.styles';

type EventActionsProps = Pick<
  Event,
  | 'name'
  | 'description'
  | 'salesForceId'
  | 'isParticipating'
  | 'startDate'
  | 'endDate'
  | 'mode'
  | 'meetingLink'
  | 'fullAddress'
>;

export const EventActions = ({
  name,
  description,
  salesForceId,
  isParticipating,
  startDate,
  endDate,
  mode,
  meetingLink,
  fullAddress,
}: EventActionsProps) => {
  return (
    <Card title="Inscription">
      <StyledContainer>
        <StyledStatusContainer>
          <Text>Statut</Text>
          <StyledStatusBadge enabled={isParticipating}>
            {isParticipating ? 'Inscrit' : 'Non inscrit'}
          </StyledStatusBadge>
        </StyledStatusContainer>
        <StyledButtonsContainer>
          <EventParticipateButton
            eventSalesForceId={salesForceId}
            isParticipating={isParticipating}
          />
          {isParticipating && (
            <ButtonAddToCalendar
              title={name}
              description={description}
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
        </StyledButtonsContainer>
        <Text size="small" center>
          Partagez l&apos;événement pour proposer à vos contacts d&apos;y
          participer avec vous.
        </Text>
      </StyledContainer>
    </Card>
  );
};
