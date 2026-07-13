import Link from 'next/link';
import React from 'react';
import { Text, TextProps } from 'src/components/ui';

type OpenAILegalMentionProps = Omit<TextProps, 'children'>;

export const OpenAILegalMention = ({ ...props }: OpenAILegalMentionProps) => {
  return (
    <Text size="small" center {...props}>
      En utilisant le service de saisie à partir du CV, vous acceptez également
      les{' '}
      <Link
        href="https://openai.com/fr-FR/policies/row-terms-of-use/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Conditions Générales d&apos;Utilisation d&apos;OpenAI
      </Link>
      . Vos données sont traitées par OpenAI dans le but de générer votre profil
      à partir de votre CV importé. Elles sont conservées par Entourage Pro en
      accord avec notre Politique de Confidentialité.
    </Text>
  );
};
