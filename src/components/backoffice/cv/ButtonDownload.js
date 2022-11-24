import React from 'react';
import PropTypes from 'prop-types';
import Api from 'src/api/index.ts';
import ButtonPost from 'src/components/backoffice/cv/ButtonPost';
import { gaEvent } from 'src/lib/gtag';

const ButtonDownload = ({
  disabled,
  candidateId,
  firstName,
  lastName,
  tag,
  pdfGenerating,
}) => {
  return (
    <ButtonPost
      disabled={disabled || pdfGenerating}
      style="default"
      text={
        pdfGenerating ? 'Génération du fichier PDF ...' : 'Télécharger le CV'
      }
      icon={pdfGenerating ? null : 'download'}
      action={() => {
        if (tag) gaEvent(tag);
        return Api.getCVPdf(candidateId, {
          params: {
            fileName: `${firstName}_${lastName}`,
          },
        })
          .then(({ data }) => {
            const pdfLink = document.createElement('a');
            pdfLink.href = data.pdfUrl;
            pdfLink.click();
          })
          .catch((err) => {
            console.error(err);
          });
      }}
    />
  );
};
ButtonDownload.propTypes = {
  disabled: PropTypes.bool,
  candidateId: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  tag: PropTypes.string,
  pdfGenerating: PropTypes.bool,
};
ButtonDownload.defaultProps = {
  disabled: false,
  tag: undefined,
  pdfGenerating: false,
};
export default ButtonDownload;
