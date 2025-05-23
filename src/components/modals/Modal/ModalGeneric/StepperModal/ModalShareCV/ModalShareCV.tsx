import React from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formGetEmail } from 'src/components/forms/schemas/formGetEmail';
import { StepperModal } from 'src/components/modals/Modal/ModalGeneric/StepperModal';
import { Button, Img } from 'src/components/utils';
import { LucidIcon } from 'src/components/utils/Icons/LucidIcon';
import { EXTERNAL_LINKS } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { notificationsActions } from 'src/use-cases/notifications';

interface ModalShareCVProps {
  firstName: string;
}
export const ModalShareCV = ({ firstName }: ModalShareCVProps) => {
  const dispatch = useDispatch();
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
                du projet Entourage Pro ?<br />
                <br />
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
                  })
                    .then(next)
                    .catch(() => {
                      dispatch(
                        notificationsActions.addNotification({
                          type: 'danger',
                          message: "Une erreur s'est produite ",
                        })
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
                Saviez-vous que Entourage Pro est porté par l&apos;association
                Entourage&nbsp;?
              </p>
              <div className="uk-flex uk-flex-center">
                <Img
                  height={150}
                  width={150}
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
                  variant="primary"
                >
                  En savoir plus
                  <LucidIcon name="ChevronRight" />
                </Button>
              </div>

              <div className="uk-margin-medium-top uk-flex uk-flex-right">
                <Button
                  variant="default"
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
