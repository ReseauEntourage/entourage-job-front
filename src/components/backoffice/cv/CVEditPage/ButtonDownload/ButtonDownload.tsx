import React from 'react';
import DownloadIcon from 'assets/icons/download.svg';
import { Api } from 'src/api';
import { ButtonPost } from 'src/components/utils/Button/ButtonPost';
import { gaEvent } from 'src/lib/gtag';

interface ButtonDownloadProps {
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
}: ButtonDownloadProps) => {
  return (
    <ButtonPost
      disabled={disabled || pdfGenerating}
      style="custom-primary-inverted"
      color="darkGrayFont"
      text={
        pdfGenerating ? 'Génération du fichier PDF ...' : 'Télécharger le CV'
      }
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      icon={pdfGenerating ? null : <DownloadIcon />}
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
