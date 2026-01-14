import moment from 'moment';
import 'moment/locale/fr';
import React from 'react';
import { Text, LucidIcon } from '@/src/components/ui';
import { EventMode } from '@/src/constants/events';
import { Event } from 'src/api/types';
import {
  StyledWebinarOptionLabel,
  StyledWebinarOptionLabelData,
  StyledWebinarOptionLabelDateTimeContainer,
  StyledWebinarOptionLabelDetails,
} from './WebinarOptionLabel.styles';

export interface WebinarOptionLabelProps {
  event: Event;
}

export const WebinarOptionLabel = ({ event }: WebinarOptionLabelProps) => {
  return (
    <StyledWebinarOptionLabel>
      <StyledWebinarOptionLabelDateTimeContainer>
        <Text size="large" weight="semibold">
          {moment(event.startDate)
            .format('dddd D MMMM YYYY')
            .replace(/^\w/, (c) => c.toUpperCase())}
        </Text>
        <Text>à</Text>
        <StyledWebinarOptionLabelData>
          <LucidIcon name="Clock" size={16} stroke="bold" />
          <Text weight="semibold">
            {moment(event.startDate).format('HH:mm')}
          </Text>
        </StyledWebinarOptionLabelData>
      </StyledWebinarOptionLabelDateTimeContainer>
      <StyledWebinarOptionLabelDetails>
        <StyledWebinarOptionLabelData>
          <LucidIcon name="Clock" size={16} />
          <Text>Durée : {event.duration} minutes</Text>
        </StyledWebinarOptionLabelData>
        {event.mode === EventMode.ONLINE && (
          <StyledWebinarOptionLabelData>
            <LucidIcon name="Camera" size={16} />
            <Text>Visioconférence en ligne</Text>
          </StyledWebinarOptionLabelData>
        )}
        {event.mode === EventMode.IN_PERSON && (
          <StyledWebinarOptionLabelData>
            <LucidIcon name="User" size={16} />
            <Text>Présentiel</Text>
          </StyledWebinarOptionLabelData>
        )}
      </StyledWebinarOptionLabelDetails>
    </StyledWebinarOptionLabel>
  );
};
