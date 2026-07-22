import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { ElearningGateModal } from '@/src/features/modals/ElearningGateModal/ElearningGateModal';
import { openModal } from '@/src/features/modals/Modal';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';

export function useContactEligibility() {
  const router = useRouter();
  const currentUser = useAuthenticatedUser();
  const isEligibleToContact = Boolean(currentUser.elearningCompletedAt);

  const openConversationOrGate = useCallback(
    (userId: string) => {
      if (!isEligibleToContact) {
        openModal(<ElearningGateModal />);
        return;
      }
      router.push(`/backoffice/messaging?userId=${userId}`);
    },
    [isEligibleToContact, router]
  );

  return { isEligibleToContact, openConversationOrGate };
}
