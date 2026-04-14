import moment from 'moment';
import 'moment/locale/fr';

import React from 'react';
import { LucidIcon, Text } from '@/src/components/ui';
import { SimpleLink } from '@/src/components/ui/SimpleLink';
import { EventMode } from '@/src/constants/events';
import { Event } from 'src/api/types';
import {
  StyledContainer,
  StyledElement,
  StyledSeparator,
} from './EventInfoSummary.styles';

export type EventInfoSummaryProps = Pick<
  Event,
  | 'startDate'
  | 'mode'
  | 'meetingLink'
  | 'fullAddress'
  | 'registrationCount'
  | 'isParticipating'
> & {
  displayParticipants?: boolean;
  compact?: boolean;
};

export const EventInfoSummary = ({
  startDate,
  mode,
  meetingLink,
  fullAddress,
  displayParticipants = false,
  registrationCount,
  isParticipating,
  compact = false,
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
        {mode === EventMode.IN_PERSON && (
          <StyledElement>
            <LucidIcon name="MapPin" size={20} />
            <Text>{fullAddress ? fullAddress : 'En présentiel'}</Text>
          </StyledElement>
        )}

        {/* Online Location */}
        {mode === EventMode.ONLINE && (
          <StyledElement>
            <LucidIcon name="Laptop" size={20} />
            <Text>
              En visio
              {isParticipating && meetingLink && !compact && (
                <>
                  {' : '}
                  <SimpleLink
                    href={
                      meetingLink.startsWith('http')
                        ? meetingLink
                        : `https://${meetingLink}`
                    }
                    isExternal
                    target="_blank"
                  >
                    {meetingLink}
                  </SimpleLink>
                </>
              )}
            </Text>
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
