import React from 'react';
import { Text, TextProps } from 'src/components/ui';

export type OpenAILegalMentionProps = Omit<TextProps, 'children'>;

export const OpenAILegalMention = ({ ...props }: OpenAILegalMentionProps) => {
  return (
    <Text size="small" center {...props}>
      En utilisant ce service, vous acceptez également les Conditions Générales
      d&apos;Utilisation d&apos;OpenAI. Vos données sont traitées par OpenAI
      dans le but de générer votre profil à partir de votre CV importé. Elles
      sont conservées par Entourage Pro qu&apos;en accord avec notre Politique
      de Confidentialité.
    </Text>
  );
};
