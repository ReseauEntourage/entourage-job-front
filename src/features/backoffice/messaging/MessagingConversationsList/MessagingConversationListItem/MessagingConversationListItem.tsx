import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Conversation, ConversationParticipant } from '@/src/api/types';
import { ImgUserProfile } from '@/src/components/ui';
import { ButtonIcon } from '@/src/components/ui/Button/ButtonIcon';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { useIsDesktop } from '@/src/hooks/utils';
import { selectCurrentUserId } from '@/src/use-cases/current-user';
import {
  messagingActions,
  selectSelectedConversationId,
  useArchiveConversationMutation,
  useUnarchiveConversationMutation,
} from '@/src/use-cases/messaging';
import {
  conversationHasUnreadMessages,
  getLastUserMessage,
} from '../../messaging.utils';
import {
  ContainerAvatarStyled,
  ConversationAddresee,
  MainInfos,
  ContainerStyled,
  RightColumn,
  StyledArchiveButton,
  StyledUnreadDot,
} from './MessagingConversationListItem.styles';

interface MessagingConversationListItemProps {
  conversation: Conversation;
}

export const MessagingConversationListItem = ({
  conversation,
}: MessagingConversationListItemProps) => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const [isActivated, setIsActivated] = React.useState(false);
  const isDesktop = useIsDesktop();
  const [archiveConversation] = useArchiveConversationMutation();
  const [unarchiveConversation] = useUnarchiveConversationMutation();
  const isArchived = !!conversation.archivedAt;

  const addresee = conversation.participants.find(
    (participant) => participant.id !== currentUserId
  ) as ConversationParticipant;

  const lastMessage =
    getLastUserMessage(conversation.messages) ?? conversation.messages[0];

  const hasUnreadMessages = conversationHasUnreadMessages(
    conversation,
    currentUserId
  );
  const shouldHighlightConversation = hasUnreadMessages;

  useEffect(() => {
    setIsActivated(selectedConversationId === conversation.id);
  }, [selectedConversationId, conversation.id]);

  const selectConversation = () => {
    dispatch(messagingActions.selectConversation(conversation.id));
  };

  const onClickArchiveToggle = (e: Event) => {
    e.stopPropagation();
    if (isArchived) {
      unarchiveConversation(conversation.id);
    } else {
      archiveConversation(conversation.id);
    }
  };

  return (
    <ContainerStyled
      onClick={selectConversation}
      $isActive={isActivated}
      data-testid="messaging-conversation-item"
      data-conversation-id={conversation.id}
    >
      <ContainerAvatarStyled>
        {addresee && (
          <ImgUserProfile
            user={addresee}
            size={35}
            hasPicture={addresee.userProfile?.hasPicture || false}
          />
        )}
        {hasUnreadMessages && <StyledUnreadDot />}
      </ContainerAvatarStyled>
      <RightColumn $highlight={shouldHighlightConversation}>
        <MainInfos>
          {addresee && (
            <ConversationAddresee>
              <p className="addresee-name">
                {addresee.firstName} {addresee.lastName}
              </p>
              <p>{addresee.role}</p>
            </ConversationAddresee>
          )}
          <p>{moment(lastMessage.createdAt).format('DD/MM/YYYY')}</p>
        </MainInfos>
        {lastMessage.content && (
          <p className="preview-last-message">{lastMessage.content}</p>
        )}
        {!lastMessage.content && lastMessage.medias && (
          <p className="preview-last-message">
            {lastMessage.author?.firstName} a envoyé {lastMessage.medias.length}{' '}
            fichier
            {lastMessage.medias.length > 1 ? 's' : ''}
          </p>
        )}
      </RightColumn>
      {isDesktop && (
        <StyledArchiveButton>
          <ButtonIcon
            icon={
              <LucidIcon name={isArchived ? 'ArchiveRestore' : 'Archive'} />
            }
            onClick={onClickArchiveToggle}
            variant="text"
            size="small"
            dataTestId={
              isArchived
                ? 'messaging-unarchive-button'
                : 'messaging-archive-button'
            }
          />
        </StyledArchiveButton>
      )}
    </ContainerStyled>
  );
};
