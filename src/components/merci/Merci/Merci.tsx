import React from 'react';
import { ContainerWithTextCentered, Typography } from 'src/components/utils';
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
          <Typography>{ThankYouMessages[currentType]}</Typography>
        </>
      ) : (
        <H3 title={"Merci beaucoup d'avoir répondu au formulaire !"} />
      )}
      <Typography size="large">À bientôt&nbsp;!</Typography>
      <Typography size="large">L&apos;équipe Entourage Pro</Typography>
      <StyledMerciButtonContainer>
        <Button href="/" style="secondary" className="uk-margin-large-top">
          Revenir à la page d&apos;accueil
        </Button>
      </StyledMerciButtonContainer>
    </ContainerWithTextCentered>
  );
};
