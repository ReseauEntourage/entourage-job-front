import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formAddPrivateOpportunity } from 'src/components/forms/schemas/formAddOpportunity';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { notificationsActions } from 'src/use-cases/notifications';

interface PostPrivateOpportunityModalProps {
  candidateId: string;
  candidateFirstName: string;
  candidateLastName: string;
}

export function PostPrivateOpportunityModal({
  candidateId,
  candidateFirstName,
  candidateLastName,
}: PostPrivateOpportunityModalProps) {
  const dispatch = useDispatch();
  const [lastFilledForm, setLastFilledForm] = useState<
    ExtractFormSchemaValidation<typeof formAddPrivateOpportunity>
  >({} as ExtractFormSchemaValidation<typeof formAddPrivateOpportunity>);

  const [shouldHide, setShouldHide] = useState<boolean>(false);

  const postOpportunity = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formAddPrivateOpportunity>,
      closeModal
    ) => {
      const { openNewForm, department, address, ...opportunity } = fields;

      gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_UNIQUE_CLIC);
      fbEvent(FB_TAGS.COMPANY_CV_OFFER_SEND);

      const successMessage = `Merci pour votre offre, le binôme reviendra bientôt vers vous.`;

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
          isPublic: false,
          candidatesIds: [candidateId],
          message: opportunity.message,
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          recruiterPhone: opportunity.recruiterPhone || null,
          date: moment().toISOString(),
        });

        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: successMessage,
          })
        );

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
            {} as ExtractFormSchemaValidation<typeof formAddPrivateOpportunity>
          );
        }
      } catch (err) {
        console.error(err);
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: "Une erreur s'est produite",
          })
        );
      }
    },
    [candidateId, dispatch]
  );

  const modalProps = useMemo(() => {
    return {
      title: `Proposer une opportunité à ${candidateFirstName} ${candidateLastName}`,
      description: (
        <div className="uk-text-normal">
          Contactez ici le candidat et son coach Entourage Pro afin de
          solliciter un échange.
          <br />
          <br />
          Si vous souhaitez échanger avec le coach bénévole qui accompagne le
          candidat dans sa recherche d&apos;emploi, précisez-le dans votre
          message.
          <br />
          <br />
          <span className="uk-text-meta uk-text-italic">
            Entourage Pro est susceptible de transmettre cette opportunité à
            d&apos;autres candidats dont le profil correspond à votre besoin.
          </span>
        </div>
      ),
      formSchema: formAddPrivateOpportunity,
      submitText: 'Envoyer',
      defaultValues: {
        ...lastFilledForm,
        shouldSendNotifications: true,
      },
      onError: () => {
        gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_UNIQUE_INVALIDE);
      },
      onSubmit: async (fields, closeModal) => {
        await postOpportunity(fields, closeModal);
      },
    };
  }, [candidateFirstName, candidateLastName, lastFilledForm, postOpportunity]);

  return !shouldHide && <ModalEdit {...modalProps} />;
}
