import PropTypes from 'prop-types';
import React from 'react';
import UIkit from 'uikit';

import { Api } from 'src/api';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formGetEmail } from 'src/components/forms/schema/formGetEmail';
import { StepperModal } from 'src/components/modals/Modal/ModalGeneric/StepperModal';
import { Button, Img, Icon } from 'src/components/utils';
import { EXTERNAL_LINKS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { useNewsletterTracking } from 'src/hooks';
import { gaEvent } from 'src/lib/gtag';

export const ModalShareCV = ({ firstName }) => {
  const newsletterParams = useNewsletterTracking();

  return (
    <StepperModal
      title="Merci pour votre partage."
      composers={[
        (close, next) => {
          return (
            <>
              <p>
                Pour {firstName}, votre action peut tout changer !<br />
                <br />
                Vous souhaitez être informé(e) de la suite pour {firstName} ? Et
                du projet LinkedOut ?<br />
                Laissez-nous votre adresse mail :
              </p>
              <FormWithValidation
                formSchema={formGetEmail}
                submitText="Envoyer"
                onCancel={close}
                onSubmit={({ email }) => {
                  gaEvent(GA_TAGS.POPUP_PARTAGE_ENVOYER_MAIL_SUCCES);
                  return Api.postNewsletter({
                    email,
                    ...newsletterParams,
                  })
                    .then(next)
                    .catch(() => {
                      return UIkit.notification(
                        'Une erreur est survenue',
                        'danger'
                      );
                    });
                }}
              />
            </>
          );
        },
        (close) => {
          return (
            <div className="uk-flex uk-flex-column">
              <p className="uk-text-center uk-flex-1 uk-margin-medium-top">
                Saviez-vous que LinkedOut est porté par l&apos;association
                Entourage&nbsp;?
              </p>
              <div className="uk-flex uk-flex-center">
                <Img
                  className="uk-height-max-small uk-margin-medium-top"
                  src="/static/img/logo-entourage.png"
                  alt="Logo Entourage"
                />
              </div>
              <div className="uk-flex uk-flex-center uk-margin-medium-top">
                <Button
                  isExternal
                  newTab
                  onClick={() => {
                    gaEvent(GA_TAGS.POPUP_PARTAGE_SITE_ENTOURAGE_CLIC);
                    close();
                  }}
                  href={EXTERNAL_LINKS.ENTOURAGE}
                  style="primary"
                >
                  En savoir plus&nbsp;
                  <Icon name="chevron-right" />
                </Button>
              </div>

              <div className="uk-margin-medium-top uk-flex uk-flex-right">
                <Button
                  style="default"
                  onClick={() => {
                    return close();
                  }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          );
        },
      ]}
    />
  );
};

ModalShareCV.propTypes = {
  firstName: PropTypes.string,
};

ModalShareCV.defaultProps = {
  firstName: undefined,
};
