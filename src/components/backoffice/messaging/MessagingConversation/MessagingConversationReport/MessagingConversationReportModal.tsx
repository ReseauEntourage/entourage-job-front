import React, { useCallback, useMemo } from 'react';
import { Api } from 'src/api';
import { ConversationReportDto } from 'src/api/types';
import { formReportUser } from 'src/components/forms/schemas/formReportUser';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Actions } from 'src/constants/utils';
import { useOnReportMessagingConversationFormSubmit } from './useOnReportMessagingConversationFormSubmit';

interface MessagingConversationReportModalProps {
  conversationId: string;
  content?: string | null;
}

export const MessagingConversationReportModal = ({
  conversationId,
  content = null,
}: MessagingConversationReportModalProps) => {
  const { onSubmit } = useOnReportMessagingConversationFormSubmit(
    async (conversationReportDto: ConversationReportDto) => {
      return Api.reportMessage(conversationId, conversationReportDto);
    },
    Actions.CREATE
  );

  const handleReportUserSubmit = useCallback(
    async (fields, closeModal) => {
      await onSubmit(fields, closeModal);
    },
    [onSubmit]
  );

  const updateUserModalProps = useMemo(() => {
    return {
      formId: 'id',
      formSchema: formReportUser,
      title: 'Signaler une conversation',
      description:
        'Vous pouvez signaler une conversation si vous pensez qu’elle ne respecte pas les règles de la plateforme.',
      submitText: 'Envoyer',
      cancelText: 'Annuler',
      onSubmit: handleReportUserSubmit,
      defaultValues: {
        reason: '',
        comment: content || '',
      },
    };
  }, [content, handleReportUserSubmit]);

  return <ModalEdit {...updateUserModalProps} />;
};
