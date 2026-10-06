import React from 'react';
import { Api } from '@/src/api';
import { ReportDto } from '@/src/api/types';
import {
  REPORT_MODAL_TITLES,
  ReportModal,
  sendReport,
} from '@/src/features/modals/ReportModal';

interface MessagingConversationReportModalProps {
  conversationId: string;
  // Content of a suspicious message, which pre-fills the comment
  content?: string | null;
}

/**
 * Report of a conversation, through the shared report modal.
 */
export const MessagingConversationReportModal = ({
  conversationId,
  content = null,
}: MessagingConversationReportModalProps) => {
  return (
    <ReportModal
      title={REPORT_MODAL_TITLES.conversation}
      defaultComment={content}
      onSubmit={(dto: ReportDto) =>
        sendReport(() => Api.reportMessage(conversationId, dto))
      }
      dataTestId="messaging-conversation-report-modal"
    />
  );
};
