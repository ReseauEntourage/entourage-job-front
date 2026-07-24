import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
  BadgeVariant,
  ImgUserProfile,
  Text,
  Tooltip,
} from '@/src/components/ui';
import { ButtonIcon } from '@/src/components/ui/Button/ButtonIcon';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { openModal } from '@/src/features/modals/Modal';
import { MessagingConversationReportModal } from '../MessagingConversationReport/MessagingConversationReportModal';
import {
  ConversationParticipant,
  ConversationParticipants,
} from 'src/api/types';
import { useIsDesktop, useIsMobile } from 'src/hooks/utils';
import {
  selectCurrentUser,
  selectCurrentUserId,
} from 'src/use-cases/current-user';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
} from 'src/use-cases/messaging';
import { ActionList } from './ActionList/ActionList';
import {
  AddreseeBadges,
  AddreseeInfosContainer,
  AddreseeSection,
  ConversationAddresee,
  LeftColumn,
  MessagingConversationHeaderContainer,
  MessagingConversationHeaderMainInfos,
} from './MessagingConversationHeader.styles';

const ADMIN_EXEMPTION_INDICATOR_LABEL =
  'Formation non terminée - visible uniquement par les administrateurs.';

export const MessagingConversationHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const currentUserId = useSelector(selectCurrentUserId);
  const currentUser = useSelector(selectCurrentUser);

  const addresees = selectedConversation?.participants.filter(
    (participant) => participant.id !== currentUserId
  ) as ConversationParticipants;
  const addresee = addresees ? (addresees[0] as ConversationParticipant) : null;
  const showAdminExemptionIndicator =
    currentUser?.role === UserRoles.ADMIN &&
    !!addresee &&
    !addresee.elearningCompletedAt;

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
                  <AddreseeBadges>
                    <Badge
                      size="small"
                      variant={BadgeVariant.HoverBlue}
                      borderRadius="large"
                    >
                      {addresee.role}
                    </Badge>
                    {showAdminExemptionIndicator && (
                      <Tooltip
                        content={ADMIN_EXEMPTION_INDICATOR_LABEL}
                        ariaLabel={ADMIN_EXEMPTION_INDICATOR_LABEL}
                      >
                        <Badge
                          size="small"
                          variant={BadgeVariant.ExtraLightAmber}
                          borderRadius="large"
                        >
                          <LucidIcon name="EyeOff" size={14} />
                        </Badge>
                      </Tooltip>
                    )}
                  </AddreseeBadges>
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
