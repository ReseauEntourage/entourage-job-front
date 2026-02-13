import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, LucidIcon } from '@/src/components/ui';
import { Text } from '@/src/components/ui/Text';
import { useSendVerifyEmail } from '@/src/components/verify-email/useSendVerifyEmail';
import { COLORS } from '@/src/constants/styles';
import {
  StyledConfirmationActions,
  StyledConfirmationIcon,
  StyledConfirmationIntro,
  StyledConfirmationResendEmail,
  StyledHelp,
  StyledHelpList,
} from './Confirmation.styles';
import { useConfirmation } from './useConfirmation';

const RESEND_COOLDOWN_SECONDS = 30;

export function Confirmation() {
  const { email, webmailProvider } = useConfirmation();
  const { sendVerifyEmail } = useSendVerifyEmail(email);

  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState<number>(
    RESEND_COOLDOWN_SECONDS
  );
  const [hasResentEmail, setHasResentEmail] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const canResend = useMemo(
    () => !hasResentEmail && !isResending && cooldownSecondsLeft <= 0,
    [cooldownSecondsLeft, hasResentEmail, isResending]
  );

  useEffect(() => {
    if (hasResentEmail || cooldownSecondsLeft <= 0) {
      return;
    }
    const intervalId = window.setInterval(() => {
      setCooldownSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [cooldownSecondsLeft, hasResentEmail]);

  const handleResendEmail = useCallback(() => {
    if (!canResend) {
      return;
    }
    setIsResending(true);
    sendVerifyEmail();
    setHasResentEmail(true);
    setIsResending(false);
  }, [canResend, sendVerifyEmail]);

  return (
    <Card title="Votre inscription est presque terminée !">
      <StyledConfirmationIntro>
        <StyledConfirmationIcon>
          <LucidIcon name="Inbox" size={64} color={COLORS.primaryBlue} />
        </StyledConfirmationIcon>

        <Text size="large" weight="bold" center>
          Vérifiez votre boîte mail
        </Text>
        <Text center>
          Nous venons de vous envoyer un email de confirmation
          {email ? ` à ${email}` : ''}. Cliquez sur le lien dans cet email pour
          activer votre compte.
        </Text>
      </StyledConfirmationIntro>

      {webmailProvider && (
        <StyledConfirmationActions>
          <Button
            variant="primary"
            rounded
            href={webmailProvider?.url}
            size="large"
            isExternal
            newTab
            style={{ display: 'block', width: '100%' }}
          >
            {`Ouvrir ${webmailProvider.label}`}
          </Button>
        </StyledConfirmationActions>
      )}

      <StyledHelp>
        <Text weight="bold">Vous ne voyez pas l’email ?</Text>
        <StyledHelpList>
          <li>
            <Text size="small">
              Vérifiez vos dossiers « Indésirables / Spam ».
            </Text>
          </li>
          <li>
            <Text size="small">Attendez 1 à 2 minutes puis actualisez.</Text>
          </li>
          <li>
            <Text size="small">
              Recherchez « Entourage Pro » dans votre boîte de réception.
            </Text>
          </li>
        </StyledHelpList>
      </StyledHelp>

      <StyledConfirmationResendEmail>
        {email && (
          <>
            {hasResentEmail ? (
              <Text size="small" color="lightGreen">
                Un nouvel email permettant de vérifier votre compte vient de
                vous être envoyé
              </Text>
            ) : (
              <Text size="small" weight="semibold">
                Vous n'avez toujours pas reçu l'email ?{' '}
                {cooldownSecondsLeft > 0 ? (
                  `Vous pourrez envoyer un nouvel email de validation dans ${cooldownSecondsLeft}s`
                ) : (
                  <Link
                    onClick={handleResendEmail}
                    href={'#resend-verify-email'}
                  >
                    Renvoyer un email de validation
                  </Link>
                )}
              </Text>
            )}
          </>
        )}
      </StyledConfirmationResendEmail>
    </Card>
  );
}
