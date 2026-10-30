import React from 'react';
import { Alert, Button, ButtonIcon, Text } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import {
  StyledMessagingAIAssistantBannerActions,
  StyledMessagingAIAssistantBannerCompactRow,
} from './MessagingAIAssistantBanner.styles';

interface MessagingAIAssistantBannerProps {
  onOpenAssistant: () => void;
  onDismiss: () => void;
  // Mobile: a single line with "Ouvrir" and a dismiss cross (same effect as
  // "Non merci") instead of the two full-width buttons shown on desktop.
  compact?: boolean;
}

export const MessagingAIAssistantBanner = ({
  onOpenAssistant,
  onDismiss,
  compact = false,
}: MessagingAIAssistantBannerProps) => {
  if (compact) {
    return (
      <Alert
        type={AlertType.Info}
        variant="outlined"
        rounded={false}
        closable
        onClose={onDismiss}
        dataTestId="messaging-ai-assistant-banner"
      >
        <StyledMessagingAIAssistantBannerCompactRow>
          <Text size="small">Besoin d&apos;aide pour répondre ?</Text>
          <Button
            variant="default"
            size="small"
            rounded
            onClick={onOpenAssistant}
          >
            Ouvrir
          </Button>
        </StyledMessagingAIAssistantBannerCompactRow>
      </Alert>
    );
  }

  return (
    <Alert
      type={AlertType.Info}
      variant="outlined"
      rounded={false}
      title="Besoin d'aide pour répondre ?"
      dataTestId="messaging-ai-assistant-banner"
      icon={
        <ButtonIcon
          icon={<LucidIcon name="Sparkles" />}
          color={COLORS.primaryBlue}
        />
      }
    >
      <StyledMessagingAIAssistantBannerActions>
        <Button
          variant="primary"
          size="small"
          rounded
          onClick={onOpenAssistant}
        >
          Ouvrir l&apos;assistant
        </Button>
        <Button variant="default" size="small" rounded onClick={onDismiss}>
          Non merci
        </Button>
      </StyledMessagingAIAssistantBannerActions>
    </Alert>
  );
};
