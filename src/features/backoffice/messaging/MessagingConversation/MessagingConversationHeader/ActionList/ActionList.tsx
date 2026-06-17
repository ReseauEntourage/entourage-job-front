import { useDispatch, useSelector } from 'react-redux';
import {
  ConversationParticipant,
  ConversationParticipants,
  FeatureKey,
} from '@/src/api/types';
import { Button, LucidIcon } from '@/src/components/ui';
import { UserRoles } from '@/src/constants/users';
import { useIsMobile } from '@/src/hooks/utils';
import {
  selectCurrentUser,
  selectCurrentUserId,
  selectHasBetaFeature,
} from '@/src/use-cases/current-user';
import {
  messagingActions,
  selectActivePanelView,
  selectIsAIPanelOpen,
  selectSelectedConversation,
} from '@/src/use-cases/messaging';
import { MessagingPanelView } from '@/src/use-cases/messaging/messaging.slice';
import { StyledButtonContainer } from '../MessagingConversationHeader.styles';
import { MessagingShareNetwork } from '../MessagingShareNetwork/MessagingShareNetwork';

export const ActionList = () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentUserId = useSelector(selectCurrentUserId);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const hasMessagingAIAssistant = useSelector(
    selectHasBetaFeature(FeatureKey.MESSAGING_AI_ASSISTANT)
  );
  const selectedConversation = useSelector(selectSelectedConversation);

  const addresees = selectedConversation?.participants.filter(
    (participant) => participant.id !== currentUserId
  ) as ConversationParticipants;
  const addresee = addresees ? (addresees[0] as ConversationParticipant) : null;
  const canUseAIAssistant =
    currentUser?.role !== UserRoles.CANDIDATE && hasMessagingAIAssistant;

  const isOneToOneConversation = selectedConversation?.type === 'direct';
  const canShareNetwork =
    isOneToOneConversation && addresee?.role === UserRoles.CANDIDATE;

  const isAIPanelOpen = useSelector(selectIsAIPanelOpen);
  const activePanelView = useSelector(selectActivePanelView);

  const onSelectPanel = (view: MessagingPanelView) => {
    if (isAIPanelOpen && activePanelView === view) {
      dispatch(messagingActions.setIsAIPanelOpen(false));
    } else {
      dispatch(messagingActions.setActivePanelView(view));
    }
  };

  return (
    <StyledButtonContainer>
      {canShareNetwork && (
        <MessagingShareNetwork
          profileId={addresee.id}
          firstName={addresee.firstName}
        />
      )}
      {canUseAIAssistant && (
        <Button
          prependIcon={<LucidIcon name="Sparkles" />}
          onClick={() => onSelectPanel('ai')}
          size="small"
          variant="secondary"
          rounded={false}
        >
          Assitant {!isMobile && 'Coach'}
        </Button>
      )}
    </StyledButtonContainer>
  );
};
