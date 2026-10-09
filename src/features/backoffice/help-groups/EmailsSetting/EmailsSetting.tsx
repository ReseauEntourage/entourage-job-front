import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Text } from '@/src/components/ui';
import { H5 } from '@/src/components/ui/Headings';
import { ToggleSwitch } from '@/src/components/ui/Inputs/ToggleSwitch/ToggleSwitch';
import { useUpdateHelpGroupEmailsMutation } from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import {
  EMAILS_SETTING_DESCRIPTION,
  EMAILS_SETTING_ERROR,
  EMAILS_SETTING_LABEL,
} from '../help-groups-participation.labels';
import {
  StyledEmailsSetting,
  StyledEmailsSettingHeader,
} from './EmailsSetting.styles';

interface EmailsSettingProps {
  slug: string;
  emailsEnabled: boolean;
  // From `?emails=1`, the link of the emails: scrolled to and highlighted
  isHighlighted: boolean;
}

/**
 * "Emails de ce groupe", for a member: turns off the notification emails
 * of the group and its share of the weekly digest, without leaving it.
 */
export function EmailsSetting({
  slug,
  emailsEnabled,
  isHighlighted,
}: EmailsSettingProps) {
  const dispatch = useDispatch();
  const ref = useRef<HTMLElement>(null);
  // Disabled while a change is saved: overlapping optimistic updates could
  // roll back a later choice
  const [updateEmails, { isLoading }] = useUpdateHelpGroupEmailsMutation();

  useEffect(() => {
    if (isHighlighted) {
      ref.current?.scrollIntoView?.({ block: 'center' });
    }
  }, [isHighlighted]);

  const onChange = async (checked: boolean) => {
    const result = await updateEmails({ slug, emailsEnabled: checked });
    if ('error' in result && result.error) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: EMAILS_SETTING_ERROR,
        })
      );
    }
  };

  return (
    <StyledEmailsSetting
      ref={ref}
      $isHighlighted={isHighlighted}
      data-testid="emails-setting"
      data-highlighted={isHighlighted}
    >
      <StyledEmailsSettingHeader>
        <H5 title={EMAILS_SETTING_LABEL} weight="semibold" noMarginBottom />
        <ToggleSwitch
          checked={emailsEnabled}
          onChange={onChange}
          ariaLabel={EMAILS_SETTING_LABEL}
          disabled={isLoading}
        />
      </StyledEmailsSettingHeader>
      <Text size="small" color="darkGray">
        {EMAILS_SETTING_DESCRIPTION}
      </Text>
    </StyledEmailsSetting>
  );
}
