import React from 'react';
import { Button, Card, LucidIcon } from '@/src/components/ui';
import { Text } from '@/src/components/ui/Text';
import { COLORS } from '@/src/constants/styles';
import {
  StyledConfirmationActions,
  StyledConfirmationIcon,
  StyledConfirmationIntro,
  StyledHelp,
  StyledHelpList,
} from './Confirmation.styles';
import { useConfirmation } from './useConfirmation';

export function Confirmation() {
  const { email, webmailProvider } = useConfirmation();

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
          <li>
            <Text size="small">
              Contactez notre équipe pour obtenir de l'aide.
            </Text>
          </li>
        </StyledHelpList>
      </StyledHelp>
    </Card>
  );
}
