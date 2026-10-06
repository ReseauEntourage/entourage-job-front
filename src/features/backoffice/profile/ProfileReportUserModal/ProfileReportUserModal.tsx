import React from 'react';
import { Api } from '@/src/api';
import { ReportDto } from '@/src/api/types';
import {
  REPORT_MODAL_TITLES,
  ReportModal,
  sendReport,
} from '@/src/features/modals/ReportModal';

interface ProfileReportUserModalProps {
  userId: string;
}

/**
 * Report of a profile, through the shared report modal.
 */
export const ProfileReportUserModal = ({
  userId,
}: ProfileReportUserModalProps) => {
  return (
    <ReportModal
      title={REPORT_MODAL_TITLES.profile}
      onSubmit={(dto: ReportDto) =>
        sendReport(() => Api.postProfileUserAbuse(userId, dto))
      }
      dataTestId="profile-report-modal"
    />
  );
};
