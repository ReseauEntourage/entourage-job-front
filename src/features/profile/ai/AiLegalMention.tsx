import Link from 'next/link';
import React from 'react';
import { Text, TextProps } from '@/src/components/ui';

type AiLegalMentionProps = Omit<TextProps, 'children'>;

export const AiLegalMention = ({ ...props }: AiLegalMentionProps) => {
  return (
    <Text size="small" center {...props}>
      Pour générer votre profil, votre CV importé est traité par Anthropic,
      notre prestataire d&apos;intelligence artificielle. Conformément à ses{' '}
      <Link
        href="https://www.anthropic.com/legal/commercial-terms"
        target="_blank"
        rel="noopener noreferrer"
      >
        Conditions Commerciales
      </Link>
      , Anthropic n&apos;utilise pas ces données pour entraîner ses modèles.
      Elles sont conservées par Entourage Pro en accord avec notre{' '}
      <Link href="/data-privacy" target="_blank">
        Politique de Confidentialité
      </Link>
      .
    </Text>
  );
};
