import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import UIkit from 'uikit';

import { Api } from 'src/api';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formAddPublicOpportunity } from 'src/components/forms/schemas/formAddOpportunity';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';

export function PostPublicOpportunityModal() {
  const [lastFilledForm, setLastFilledForm] = useState<
    ExtractFormSchemaValidation<typeof formAddPublicOpportunity>
  >({} as ExtractFormSchemaValidation<typeof formAddPublicOpportunity>);

  const [shouldHide, setShouldHide] = useState<boolean>(false);

  const postOpportunity = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formAddPublicOpportunity>,
      closeModal
    ) => {
      const { openNewForm, department, address, ...opportunity } = fields;

      gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_CLIC);
      fbEvent(FB_TAGS.COMPANY_GENERAL_OFFER_SEND);

      const successMessage =
        'Merci pour votre offre, nous reviendrons bientôt vers vous.';

      try {
        await Api.postOpportunity({
          ...opportunity,
          locations: fields.locations.map(
            ({ department: locationDepartment, address: locationAddress }) => {
              return {
                department: locationDepartment.value,
                address: locationAddress,
              };
            }
          ),
          candidatesIds: null,
          message: null,
          isPublic: true,
          shouldSendNotifications: true,
          recruiterPhone: opportunity.recruiterPhone || null,
          date: moment().toISOString(),
        });

        UIkit.notification(successMessage, 'success');

        if (openNewForm) {
          setShouldHide(true);

          setLastFilledForm({
            ...fields,
          });

          setTimeout(() => {
            setShouldHide(false);
          }, 1000);
        } else {
          closeModal();

          setLastFilledForm(
            {} as ExtractFormSchemaValidation<typeof formAddPublicOpportunity>
          );
        }
      } catch (err) {
        UIkit.notification(`Une erreur est survenue.`, 'danger');
      }
    },
    []
  );

  const modalProps = useMemo(() => {
    return {
      title: 'Proposer une opportunité',
      description:
        'LinkedOut transmettra cette opportunité aux candidats dont le profil correspond à votre besoin.',
      formSchema: formAddPublicOpportunity,
      submitText: 'Envoyer',
      defaultValues: {
        ...lastFilledForm,
        shouldSendNotifications: true,
      },
      onError: () => {
        gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_INVALIDE);
      },
      onSubmit: async (fields, closeModal) => {
        await postOpportunity(fields, closeModal);
      },
    };
  }, [lastFilledForm, postOpportunity]);

  return !shouldHide && <ModalEdit {...modalProps} />;
}
