import moment from 'moment';
import 'moment/locale/fr';
import React from 'react';
import { Text, LucidIcon } from '@/src/components/ui';
import { EventMode } from '@/src/constants/events';
import { Event } from 'src/api/types';
import {
  StyledSelectOptionWebinarLabel,
  StyledSelectOptionWebinarLabelData,
  StyledSelectOptionWebinarLabelDateTimeContainer,
  StyledSelectOptionWebinarLabelDetails,
} from './SelectOptionWebinarLabel.styles';

export interface SelectOptionWebinarLabelProps {
  event: Event;
}

export const SelectOptionWebinarLabel = ({
  event,
}: SelectOptionWebinarLabelProps) => {
  return (
    <StyledSelectOptionWebinarLabel>
      <StyledSelectOptionWebinarLabelDateTimeContainer>
        <Text size="large" weight="semibold">
          {moment(event.startDate)
            .format('dddd D MMMM YYYY')
            .replace(/^\w/, (c) => c.toUpperCase())}
        </Text>
        <Text>à</Text>
        <StyledSelectOptionWebinarLabelData>
          <LucidIcon name="Clock" size={16} stroke="bold" />
          <Text weight="semibold">
            {moment(event.startDate).format('HH:mm')}
          </Text>
        </StyledSelectOptionWebinarLabelData>
      </StyledSelectOptionWebinarLabelDateTimeContainer>
      <StyledSelectOptionWebinarLabelDetails>
        <StyledSelectOptionWebinarLabelData>
          <LucidIcon name="Clock" size={16} />
          <Text>Durée : {event.duration} minutes</Text>
        </StyledSelectOptionWebinarLabelData>
        {event.mode === EventMode.ONLINE && (
          <StyledSelectOptionWebinarLabelData>
            <LucidIcon name="Camera" size={16} />
            <Text>Visioconférence en ligne</Text>
          </StyledSelectOptionWebinarLabelData>
        )}
        {event.mode === EventMode.IN_PERSON && (
          <StyledSelectOptionWebinarLabelData>
            <LucidIcon name="User" size={16} />
            <Text>Présentiel</Text>
          </StyledSelectOptionWebinarLabelData>
        )}
      </StyledSelectOptionWebinarLabelDetails>
    </StyledSelectOptionWebinarLabel>
  );
};
