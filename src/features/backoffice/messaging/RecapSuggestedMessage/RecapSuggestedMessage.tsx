import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileRecommendation } from '@/src/api/types';
import { Button } from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings/H3';
import { UserRoles } from '@/src/constants/users';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { MessagingInput } from '@/src/features/backoffice/messaging/MessagingConversation/MessagingEditor/MessagingEditor.styles';
import { selectCurrentUserProfile } from '@/src/use-cases/current-user';
import { messagingActions, selectNewMessage } from '@/src/use-cases/messaging';
import {
  StyledRecapSuggestedMessage,
  StyledRecapSuggestedMessageInputContainer,
} from './RecapSuggestedMessage.styles';
import { getRecapSuggestedMessage } from './RecapSuggestedMessage.utils';

interface RecapSuggestedMessageProps {
  recommendation: ProfileRecommendation;
  // Called synchronously on click, regardless of whether the send
  // succeeds or fails. Marks onboarding completed and arms the post-send
  // redirect carried by useWizardRedirects — cf. its comment for the why:
  // this component is unmounted before the send could resolve.
  onSend: () => void;
}

export const RecapSuggestedMessage = ({
  recommendation,
  onSend,
}: RecapSuggestedMessageProps) => {
  const dispatch = useDispatch();
  const currentUser = useAuthenticatedUser();
  const currentUserProfile = useSelector(selectCurrentUserProfile);
  const newMessage = useSelector(selectNewMessage);
  const [isSending, setIsSending] = useState(false);

  const recommendedProfile = recommendation.publicProfile;
  const isSenderCandidate = currentUser.role === UserRoles.CANDIDATE;
  const hasInitializedMessageRef = useRef(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (hasInitializedMessageRef.current) {
      return;
    }
    hasInitializedMessageRef.current = true;

    const candidateProfile = isSenderCandidate
      ? { sectorOccupations: currentUserProfile?.sectorOccupations }
      : { sectorOccupations: recommendedProfile.sectorOccupations };
    // The suggested nudge is the one common to both profiles: it doesn't
    // matter which one is "candidate"/"coach" here, only the intersection of
    // the two counts.
    const candidateNudges = isSenderCandidate
      ? currentUserProfile?.nudges
      : recommendedProfile.nudges;
    const coachNudges = isSenderCandidate
      ? recommendedProfile.nudges
      : currentUserProfile?.nudges;

    dispatch(
      messagingActions.setNewMessage(
        getRecapSuggestedMessage({
          senderRole: currentUser.role as UserRoles,
          senderFirstName: currentUser.firstName,
          recipientFirstName: recommendedProfile.firstName,
          candidateProfile,
          candidateNudges,
          coachNudges,
        })
      )
    );
    // The suggested message is only initialized once: once the user is
    // editing, profile data that arrives later must not overwrite their input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const adjustMessageHeight = () => {
    if (!messageInputRef.current) {
      return;
    }
    messageInputRef.current.style.height = 'inherit';
    messageInputRef.current.style.height = `${messageInputRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    adjustMessageHeight();
  }, [newMessage]);

  useLayoutEffect(adjustMessageHeight, []);

  const handleSend = () => {
    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('participantIds[]', recommendedProfile.id);
    dispatch(messagingActions.postMessageRequested(formData));
    dispatch(messagingActions.setNewMessage(''));
    setIsSending(true);
    onSend();
  };

  return (
    <StyledRecapSuggestedMessage>
      <H3 title="Message suggéré, à personnaliser" />
      <StyledRecapSuggestedMessageInputContainer>
        <MessagingInput
          rows={1}
          ref={messageInputRef}
          placeholder="Écrivez votre message"
          aria-label="Message à envoyer"
          value={newMessage}
          onChange={(e) => {
            dispatch(messagingActions.setNewMessage(e.target.value));
          }}
          disabled={isSending}
        />
      </StyledRecapSuggestedMessageInputContainer>
      <Button
        dataTestId="wizard-match-recap-send-suggested-message"
        onClick={handleSend}
        variant="primary"
        size="large"
        disabled={isSending}
      >
        {`Envoyer à ${recommendedProfile.firstName}`}
      </Button>
    </StyledRecapSuggestedMessage>
  );
};
