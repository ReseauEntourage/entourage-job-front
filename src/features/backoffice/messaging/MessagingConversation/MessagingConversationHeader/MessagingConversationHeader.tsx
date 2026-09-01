import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ConversationParticipant,
  ConversationParticipants,
} from '@/src/api/types';
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
import { useIsDesktop, useIsMobile } from '@/src/hooks/utils';
import {
  selectCurrentUser,
  selectCurrentUserId,
} from '@/src/use-cases/current-user';
import {
  messagingActions,
  selectSelectedConversation,
  selectSelectedConversationId,
  useArchiveConversationMutation,
  useUnarchiveConversationMutation,
} from '@/src/use-cases/messaging';
import { MessagingConversationReportModal } from '../MessagingConversationReport/MessagingConversationReportModal';
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
const ARCHIVE_LABEL = 'Archiver la conversation';
const UNARCHIVE_LABEL = 'Désarchiver la conversation';
const REPORT_LABEL = 'Signaler la conversation';

export const MessagingConversationHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();
  const isDesktop = useIsDesktop();
  const selectedConversationId = useSelector(selectSelectedConversationId);
  const selectedConversation = useSelector(selectSelectedConversation);
  const currentUserId = useSelector(selectCurrentUserId);
  const currentUser = useSelector(selectCurrentUser);
  const [archiveConversation] = useArchiveConversationMutation();
  const [unarchiveConversation] = useUnarchiveConversationMutation();
  const isArchived = !!selectedConversation?.archivedAt;

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

  const onClickArchiveToggle = () => {
    if (!selectedConversationId) {
      return;
    }
    if (isArchived) {
      unarchiveConversation(selectedConversationId);
    } else {
      archiveConversation(selectedConversationId);
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

        {selectedConversation && (
          <Tooltip
            content={isArchived ? UNARCHIVE_LABEL : ARCHIVE_LABEL}
            ariaLabel={isArchived ? UNARCHIVE_LABEL : ARCHIVE_LABEL}
          >
            <ButtonIcon
              icon={
                <LucidIcon name={isArchived ? 'ArchiveRestore' : 'Archive'} />
              }
              onClick={onClickArchiveToggle}
              color={COLORS.teal}
              variant="text"
              dataTestId={
                isArchived
                  ? 'messaging-unarchive-button'
                  : 'messaging-archive-button'
              }
            />
          </Tooltip>
        )}

        <Tooltip content={REPORT_LABEL} ariaLabel={REPORT_LABEL}>
          <ButtonIcon
            icon={<LucidIcon name="Flag" />}
            onClick={onClickReportUser}
            color={COLORS.teal}
            variant="text"
            dataTestId="messaging-report-button"
          />
        </Tooltip>
      </MessagingConversationHeaderMainInfos>
      {isMobile && <ActionList />}
    </MessagingConversationHeaderContainer>
  );
};
