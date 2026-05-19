import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
  BadgeVariant,
  Button,
  ImgUserProfile,
  Text,
} from '@/src/components/ui';
import { ButtonIcon } from '@/src/components/ui/Button/ButtonIcon';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import { openModal } from '@/src/features/modals/Modal';
import { MessagingConversationReportModal } from '../MessagingConversationReport/MessagingConversationReportModal';
import {
  ConversationParticipant,
  ConversationParticipants,
} from 'src/api/types';
import { useIsDesktop, useIsMobile } from 'src/hooks/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import { ActionList } from './ActionList/ActionList';
import {
  AddreseeInfosContainer,
  AddreseeSection,
  ConversationAddresee,
  LeftColumn,
  MessagingConversationHeaderContainer,
  MessagingConversationHeaderMainInfos,
} from './MessagingConversationHeader.styles';

export const MessagingConversationHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const currentUserId = useSelector(selectCurrentUserId);

  const addresees = selectedConversation?.participants.filter(
    (participant) => participant.id !== currentUserId
  ) as ConversationParticipants;
  const addresee = addresees ? (addresees[0] as ConversationParticipant) : null;

  const onClickBackBtn = () => {
    dispatch(messagingActions.selectConversation(null));
  };

  const onClickAddresseeInfos = () => {
    if (!addresee) {
      return;
    }
    router.push(`/backoffice/profile/${addresee.id}`);
  };

  const onClickReportUser = () => {
    if (selectedConversationId) {
      openModal(
        <MessagingConversationReportModal
          conversationId={selectedConversationId}
        />
      );
    }
  };

  return (
    <MessagingConversationHeaderContainer>
      <MessagingConversationHeaderMainInfos>
        <LeftColumn>
          {isMobile && selectedConversation && (
            <ButtonIcon
              icon={<LucidIcon name="ChevronLeft" size={25} />}
              onClick={onClickBackBtn}
              variant="text"
            />
          )}
          {addresee && (
            <AddreseeSection>
              <AddreseeInfosContainer onClick={onClickAddresseeInfos}>
                <ImgUserProfile
                  user={addresee}
                  size={35}
                  hasPicture={addresee.userProfile?.hasPicture || false}
                />
                <ConversationAddresee>
                  <Text weight="bold" size="large">
                    {addresee.firstName} {addresee.lastName}
                  </Text>
                  <Badge
                    size="small"
                    variant={BadgeVariant.HoverBlue}
                    borderRadius="large"
                  >
                    {addresee.role}
                  </Badge>
                </ConversationAddresee>
              </AddreseeInfosContainer>
            </AddreseeSection>
          )}
        </LeftColumn>
        {isDesktop && <ActionList />}

        <ButtonIcon
          icon={<LucidIcon name="Flag" />}
          onClick={onClickReportUser}
          color={COLORS.teal}
          variant="text"
        />
      </MessagingConversationHeaderMainInfos>
      {isMobile && <ActionList />}
    </MessagingConversationHeaderContainer>
  );
};
