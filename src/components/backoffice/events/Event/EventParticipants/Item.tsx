import { useRouter } from 'next/router';
import React from 'react';
import { EventParticipant } from '@/src/api/types';
import { ImgUserProfile, Text } from '@/src/components/utils';
import { StyledItemContainer } from './EventParticipants.styles';

export interface ItemProps {
  participant: EventParticipant;
}

export const Item = ({ participant }: ItemProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/backoffice/profile/${participant.id}`);
  };
  return (
    <StyledItemContainer onClick={handleClick}>
      <ImgUserProfile
        user={participant}
        hasPicture={participant.userProfile?.hasPicture || false}
      />
      <Text>
        {participant.firstName} {participant.lastName}
      </Text>
    </StyledItemContainer>
  );
};
