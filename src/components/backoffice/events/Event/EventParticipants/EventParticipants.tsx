import React from 'react';
import { useSelector } from 'react-redux';
import { EventParticipant } from '@/src/api/types';
import { Card, LucidIcon, Text } from '@/src/components/utils';
import {
  fetchSelectedEventParticipantsSelectors,
  fetchSelectedEventSelectors,
} from '@/src/use-cases/events';
import {
  StyledEventParticipantsContainer,
  StyledLoadingContainer,
} from './EventParticipants.styles';
import { Item } from './Item';

export interface EventParticipantsProps {
  participants: EventParticipant[];
}

export const PARTICIPANTS_SUMMARY_LIMIT = 10;

export const EventParticipants = ({ participants }: EventParticipantsProps) => {
  const participantsSummary = participants.slice(0, PARTICIPANTS_SUMMARY_LIMIT);
  const isSelectedEventRequested = useSelector(
    fetchSelectedEventSelectors.selectIsFetchSelectedEventRequested
  );
  const isSelectedEventParticipantRequested = useSelector(
    fetchSelectedEventParticipantsSelectors.selectIsFetchSelectedEventParticipantsRequested
  );

  const isLoading =
    isSelectedEventRequested || isSelectedEventParticipantRequested;

  return (
    <Card title="Les participants">
      {isLoading ? (
        <StyledLoadingContainer>
          <LucidIcon name="Loader" size={24} spin />
        </StyledLoadingContainer>
      ) : (
        <StyledEventParticipantsContainer>
          <>
            {participantsSummary.length === 0 && (
              <Text>
                Aucun participant pour le moment. Soyez le premier à rejoindre
                cet événement !
              </Text>
            )}
            {/* Display participants summary */}
            {participantsSummary.map((participant) => (
              <Item key={participant.id} participant={participant} />
            ))}

            {/* Display count of additional participants if any */}
            {participants.length > PARTICIPANTS_SUMMARY_LIMIT && (
              <Text>
                et {participants.length - PARTICIPANTS_SUMMARY_LIMIT} autre
                {participants.length - PARTICIPANTS_SUMMARY_LIMIT > 1
                  ? 's'
                  : ''}{' '}
                participant
                {participants.length - PARTICIPANTS_SUMMARY_LIMIT > 1
                  ? 's'
                  : ''}
              </Text>
            )}
          </>
        </StyledEventParticipantsContainer>
      )}
    </Card>
  );
};
