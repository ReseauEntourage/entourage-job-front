import { useDispatch, useSelector } from 'react-redux';
import {
  ConversationParticipant,
  ConversationParticipants,
} from '@/src/api/types';
import { Button, LucidIcon, Tooltip } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { useIsMobile } from '@/src/hooks/utils';
import {
  selectCurrentUser,
  selectCurrentUserId,
} from '@/src/use-cases/current-user';
import {
  messagingActions,
  selectActivePanelView,
  selectIsAIPanelOpen,
  selectSelectedConversation,
} from '@/src/use-cases/messaging';
import { MessagingPanelView } from '@/src/use-cases/messaging/messaging.slice';
import {
  HeaderIconButton,
  StyledButtonContainer,
} from '../MessagingConversationHeader.styles';
import { MessagingShareNetwork } from '../MessagingShareNetwork/MessagingShareNetwork';

const ASSISTANT_LABEL = 'Assistant Coach';

export const ActionList = () => {
  const currentUser = useSelector(selectCurrentUser);
  const currentUserId = useSelector(selectCurrentUserId);
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const selectedConversation = useSelector(selectSelectedConversation);

  const addresees = selectedConversation?.participants.filter(
    (participant) => participant.id !== currentUserId
  ) as ConversationParticipants;
  const addresee = addresees ? (addresees[0] as ConversationParticipant) : null;
  const canUseAIAssistant = currentUser?.role !== UserRoles.CANDIDATE;

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

  if (!canUseAIAssistant && !canShareNetwork) {
    return null;
  }

  return (
    <StyledButtonContainer>
      {canShareNetwork && (
        <MessagingShareNetwork
          profileId={addresee.id}
          firstName={addresee.firstName}
          iconOnly={isMobile}
        />
      )}
      {canUseAIAssistant && isMobile && (
        <Tooltip content={ASSISTANT_LABEL} openOnFocus hoverOnly>
          <HeaderIconButton
            icon={<LucidIcon name="Sparkles" />}
            onClick={() => onSelectPanel('ai')}
            variant="text"
            size="large"
            color={COLORS.teal}
            ariaLabel={ASSISTANT_LABEL}
            dataTestId="messaging-ai-assistant-toggle"
          />
        </Tooltip>
      )}
      {canUseAIAssistant && !isMobile && (
        <Button
          prependIcon={<LucidIcon name="Sparkles" />}
          onClick={() => onSelectPanel('ai')}
          size="small"
          variant="secondary"
          rounded={false}
          dataTestId="messaging-ai-assistant-toggle"
        >
          {ASSISTANT_LABEL}
        </Button>
      )}
    </StyledButtonContainer>
  );
};
