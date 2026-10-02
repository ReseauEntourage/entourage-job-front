import React from 'react';
import { Button, Text } from '@/src/components/ui';
import { ContainerWithTextCentered } from '@/src/components/ui/Containers/ContainerWithTextCentered';
import { HELP_GROUPS_RETRY_LABEL } from '../help-groups.labels';

interface HelpGroupLoadErrorProps {
  message: string;
  onRetry: () => unknown;
}

/**
 * A failed read (other than a 404) is shown as such, with a retry, rather than
 * as an empty list or an endless loading screen.
 */
export function HelpGroupLoadError({
  message,
  onRetry,
}: HelpGroupLoadErrorProps) {
  return (
    <ContainerWithTextCentered>
      <div data-testid="help-group-load-error">
        <Text center>{message}</Text>
        <Button
          variant="secondary"
          dataTestId="help-group-load-error-retry"
          onClick={() => {
            onRetry();
          }}
        >
          {HELP_GROUPS_RETRY_LABEL}
        </Button>
      </div>
    </ContainerWithTextCentered>
  );
}
