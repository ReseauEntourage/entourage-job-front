import React from 'react';
import { ContainerWithTextCentered, Text } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { H3 } from 'src/components/utils/Headings';
import { StyledMerciButtonContainer } from './Merci.styles';

const ThankYouMessages = {
  coach:
    'Vous recevrez par mail toutes les informations nécessaires pour participer au Webinaire.',
  candidate: 'Nous vous donnerons des nouvelles rapidement.',
  connector:
    'Nous reviendrons rapidement vers vous pour finaliser votre engagement.',
} as const;

export type ThankYouMessagesType = keyof typeof ThankYouMessages;

export const Merci = ({
  currentType,
}: {
  currentType: ThankYouMessagesType;
}) => {
  return (
    <ContainerWithTextCentered>
      {currentType ? (
        <>
          <H3 title="Merci beaucoup pour votre inscription !" center />
          <Text>{ThankYouMessages[currentType]}</Text>
        </>
      ) : (
        <H3 title="Merci beaucoup d'avoir répondu au formulaire !" />
      )}
      <Text size="large">À bientôt&nbsp;!</Text>
      <Text size="large">L&apos;équipe Entourage Pro</Text>
      <StyledMerciButtonContainer>
        <Button href="/" style="secondary" className="uk-margin-large-top">
          Revenir à la page d&apos;accueil
        </Button>
      </StyledMerciButtonContainer>
    </ContainerWithTextCentered>
  );
};
