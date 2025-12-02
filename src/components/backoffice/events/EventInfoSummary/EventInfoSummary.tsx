import moment from 'moment';
import 'moment/locale/fr';

import React from 'react';
import { LucidIcon, Text } from '@/src/components/utils';
import { EventMode } from '@/src/constants/events';
import { Event } from 'src/api/types';
import {
  StyledContainer,
  StyledElement,
  StyledSeparator,
} from './EventInfoSummary.styles';

export type EventInfoSummaryProps = Pick<
  Event,
  'startDate' | 'mode' | 'meetingLink' | 'fullAddress' | 'registrationCount'
> & {
  displayParticipants?: boolean;
};

export const EventInfoSummary = ({
  startDate,
  mode,
  meetingLink,
  fullAddress,
  displayParticipants = false,
  registrationCount,
}: EventInfoSummaryProps) => {
  return (
    <>
      <StyledContainer>
        {/* Date start */}
        <StyledElement>
          <LucidIcon name="Calendar" size={20} />
          <Text>Le {moment(startDate).locale('fr').format('LLL')}</Text>
        </StyledElement>

        {/* IRL Location */}
        {mode === EventMode.IN_PERSON && fullAddress && (
          <StyledElement>
            <LucidIcon name="MapPin" size={20} />
            <Text>{fullAddress}</Text>
          </StyledElement>
        )}

        {/* Online Location */}
        {mode === EventMode.ONLINE && meetingLink && (
          <StyledElement>
            <LucidIcon name="Laptop" size={20} />
            <Text>En visio</Text>
          </StyledElement>
        )}
      </StyledContainer>
      {displayParticipants && (
        <>
          <StyledSeparator />
          <StyledElement>
            <LucidIcon name="Users" size={20} />
            {registrationCount === 0 ? (
              <Text>Aucun participant</Text>
            ) : (
              <Text>
                {registrationCount} participant
                {registrationCount > 1 ? 's' : ''}
              </Text>
            )}
          </StyledElement>
        </>
      )}
    </>
  );
};
