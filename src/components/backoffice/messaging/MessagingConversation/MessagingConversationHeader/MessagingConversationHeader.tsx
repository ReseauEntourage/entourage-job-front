import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft } from 'assets/icons/icons';
import { ConversationParticipants, User } from 'src/api/types';
import { ButtonIcon, ImgProfile } from 'src/components/utils';
import { useIsMobile } from 'src/hooks/utils';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import {
  messagingActions,
  selectSelectedConversation,
} from 'src/use-cases/messaging';
import {
  AddreseeInfosContainer,
  ConversationAddresee,
  LeftColumn,
  MessagingConversationHeaderContainer,
} from './MessagingConversationHeader.styles';

export const MessagingConversationHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();
  const selectedConversation = useSelector(selectSelectedConversation);
  const currentUserId = useSelector(selectCurrentUserId);
  const addresees = selectedConversation?.participants.filter(
    (participant) => participant.id !== currentUserId
  ) as ConversationParticipants;
  const addresee = addresees[0] as User;

  const onClickBackBtn = () => {
    dispatch(messagingActions.selectConversation(null));
  };

  const onClickAddresseeInfos = () => {
    router.push(`/backoffice/profile/${addresee.id}`);
  };

  return (
    <MessagingConversationHeaderContainer>
      <LeftColumn>
        {isMobile && selectedConversation && (
          <ButtonIcon
            icon={<ChevronLeft height={25} />}
            onClick={onClickBackBtn}
          />
        )}
        <AddreseeInfosContainer onClick={onClickAddresseeInfos}>
          <ImgProfile user={addresee} size={35} />
          <ConversationAddresee>
            <p className="addresee-name">
              {addresee.firstName} {addresee.lastName}
            </p>
            <p>{addresee.role}</p>
          </ConversationAddresee>
        </AddreseeInfosContainer>
      </LeftColumn>
      {/* TODO Implement new dropdown in mobile to report a user */}
      {isMobile ? <>...</> : <a className="report-link">Signaler</a>}
    </MessagingConversationHeaderContainer>
  );
};
