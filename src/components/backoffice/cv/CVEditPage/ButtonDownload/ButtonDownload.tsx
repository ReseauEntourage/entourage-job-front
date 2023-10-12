import React from 'react';
import { Api } from 'src/api';
import { ButtonPost } from 'src/components/utils/Button/ButtonPost';
import { gaEvent } from 'src/lib/gtag';

interface ButtondowloadProps {
  disabled?: boolean;
  candidateId: string;
  firstName: string;
  lastName: string;
  tag?: { action: string };
  pdfGenerating?: boolean;
}

export const ButtonDownload = ({
  disabled,
  candidateId,
  firstName,
  lastName,
  tag,
  pdfGenerating,
}: ButtondowloadProps) => {
  return (
    <ButtonPost
      disabled={disabled || pdfGenerating}
      style="custom-primary-inverted"
      color="darkGrayFont"
      text={
        pdfGenerating ? 'Génération du fichier PDF ...' : 'Télécharger le CV'
      }
      icon={pdfGenerating ? null : 'download'}
      action={async () => {
        if (tag) gaEvent(tag);
        try {
          const {
            data: { pdfUrl },
          } = await Api.getCVPdf(candidateId, {
            params: {
              fileName: `${firstName}_${lastName}`,
            },
          });
          const pdfLink = document.createElement('a');
          pdfLink.href = pdfUrl;
          pdfLink.click();
        } catch (err) {
          console.error(err);
        }
      }}
    />
  );
};