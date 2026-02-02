import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ImgUserProfile } from '@/src/components/ui';
import { ButtonIcon } from '@/src/components/ui/Button/ButtonIcon';
import { Dropdown } from '@/src/components/ui/Dropdown/Dropdown';
import { DropdownToggle } from '@/src/components/ui/Dropdown/DropdownToggle';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { openModal } from '@/src/features/modals/Modal';
import { MessagingConversationReportModal } from '../MessagingConversationReport/MessagingConversationReportModal';
import {
  ConversationParticipant,
  ConversationParticipants,
} from 'src/api/types';
import { useIsMobile } from 'src/hooks/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import {
  ActionMenuIconStyled,
  AddreseeInfosContainer,
  ConversationAddresee,
  LeftColumn,
  MessagingConversationHeaderContainer,
} from './MessagingConversationHeader.styles';

export const MessagingConversationHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();
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
    <MessagingConversationHeaderContainer className={isMobile ? 'mobile' : ''}>
      <LeftColumn>
        {isMobile && selectedConversation && (
          <ButtonIcon
            icon={<LucidIcon name="ChevronLeft" size={25} />}
            onClick={onClickBackBtn}
          />
        )}
        {addresee && (
          <AddreseeInfosContainer onClick={onClickAddresseeInfos}>
            <ImgUserProfile
              user={addresee}
              size={35}
              hasPicture={addresee.userProfile?.hasPicture || false}
            />
            <ConversationAddresee>
              <p className="addresee-name">
                {addresee.firstName} {addresee.lastName}
              </p>
              <p>{addresee.role}</p>
            </ConversationAddresee>
          </AddreseeInfosContainer>
        )}
      </LeftColumn>
      {/* TODO Implement new dropdown in mobile to report a user */}
      {isMobile ? (
        <Dropdown>
          <DropdownToggle>
            <ActionMenuIconStyled>
              <LucidIcon name="Ellipsis" size={25} />
            </ActionMenuIconStyled>
          </DropdownToggle>
          <Dropdown.Menu openDirection="left">
            <Dropdown.Item onClick={onClickReportUser}>Signaler</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <a className="report-link" onClick={onClickReportUser}>
          Signaler
        </a>
      )}
    </MessagingConversationHeaderContainer>
  );
};
