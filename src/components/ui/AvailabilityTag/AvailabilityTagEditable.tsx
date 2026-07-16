import React from 'react';
import { Button, Popover, Text } from '@/src/components/ui';
import { FeedbackModal } from '@/src/features/modals/FeedbackModal/FeedbackModal';
import { openModal } from '@/src/features/modals/Modal';
import { useUpdateProfile } from '@/src/hooks/useUpdateProfile';
import { User } from 'src/api/types';
import { AvailabilityTag } from './AvailabilityTag';
import { StyledAvailabilityTagEditableContent } from './AvailabilityTagEditable.styles';

interface AvailabilityTagEditableProps {
  isAvailable: boolean;
  user: User;
}

export const AvailabilityTagEditable = ({
  isAvailable,
  user,
}: AvailabilityTagEditableProps) => {
  const { updateUserProfile } = useUpdateProfile(user);

  const handleAction = () => {
    if (isAvailable) {
      openModal(<FeedbackModal />);
    } else {
      updateUserProfile({ isAvailable: true, unavailabilityReason: null });
    }
  };

  const label = isAvailable
    ? 'Vous souhaitez vous rendre indisponible ?'
    : 'Vous êtes de nouveau disponible ?';

  const buttonLabel = isAvailable
    ? 'Devenir indisponible'
    : 'Devenir disponible';

  return (
    <Popover
      content={
        <StyledAvailabilityTagEditableContent>
          <Text size="small">{label}</Text>
          <Button size="small" onClick={handleAction}>
            {buttonLabel}
          </Button>
        </StyledAvailabilityTagEditableContent>
      }
    >
      <AvailabilityTag isAvailable={isAvailable} />
    </Popover>
  );
};
