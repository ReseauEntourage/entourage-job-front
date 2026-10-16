import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ReportTargetType } from '@/src/api/types';
import { Button } from '@/src/components/ui';
import { TextArea } from '@/src/components/ui/Inputs';
import { notificationsActions } from '@/src/use-cases/notifications';
import { useResolveAdminReportTargetMutation } from '@/src/use-cases/reports';
import { REPORTS_TAB_LABELS } from '../reports.labels';
import {
  StyledReportResolveError,
  StyledReportResolveForm,
} from './ReportResolveForm.styles';

const NOTE_MAX_LENGTH = 1000;

interface ReportResolveFormProps {
  targetType: ReportTargetType;
  targetId: string;
}

/**
 * Closes every report still to handle on a conversation or a profile, with
 * an optional internal note. Nobody is told about it.
 */
export function ReportResolveForm({
  targetType,
  targetId,
}: ReportResolveFormProps) {
  const dispatch = useDispatch();
  const [note, setNote] = useState('');
  const [hasError, setHasError] = useState(false);
  const [resolve, { isLoading }] = useResolveAdminReportTargetMutation();

  const submit = async () => {
    if (isLoading) {
      return;
    }
    setHasError(false);
    const result = await resolve({
      targetType,
      targetId,
      note: note.trim() || undefined,
    });
    if ('error' in result && result.error) {
      setHasError(true);
      return;
    }
    setNote('');
    dispatch(
      notificationsActions.addNotification({
        type: 'success',
        message: REPORTS_TAB_LABELS.resolveDone,
      })
    );
  };

  return (
    <StyledReportResolveForm data-testid="report-resolve-form">
      <TextArea
        id="report-resolve-note"
        name="report-resolve-note"
        title={REPORTS_TAB_LABELS.resolveNote}
        showLabel
        rows={3}
        maxLength={NOTE_MAX_LENGTH}
        value={note}
        onChange={setNote}
      />
      {hasError && (
        <StyledReportResolveError role="alert">
          {REPORTS_TAB_LABELS.resolveError}
        </StyledReportResolveError>
      )}
      <Button
        variant="primary"
        disabled={isLoading}
        onClick={submit}
        dataTestId="report-resolve-submit"
      >
        {REPORTS_TAB_LABELS.resolveSubmit}
      </Button>
    </StyledReportResolveForm>
  );
}
