import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { DefaultValues } from 'react-hook-form';
import UIkit from 'uikit';

import { Api } from 'src/api';
import {
  ExtractFormSchemaValidation,
  FormSchema,
} from 'src/components/forms/FormSchema';
import {
  formAddOpportunity,
  formAddOpportunityAsAdmin,
} from 'src/components/forms/schemas/formAddOpportunity';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useNewsletterTracking } from 'src/hooks/useNewsletterTracking';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { AnyCantFix } from 'src/utils/Types';

interface PostOpportunityModalProps<S extends FormSchema<AnyCantFix>> {
  modalTitle: string;
  modalDesc?: string | JSX.Element;
  isAdmin?: boolean;
  callback?: () => void;
  formSchema: S;
  defaultValues?: DefaultValues<ExtractFormSchemaValidation<S>>;
}
export function PostOpportunityModal<
  S extends typeof formAddOpportunity | typeof formAddOpportunityAsAdmin
>({
  modalTitle,
  modalDesc,
  isAdmin = false,
  callback,
  defaultValues,
  formSchema,
}: PostOpportunityModalProps<S>) {
  const [lastFilledForm, setLastFilledForm] = useState<
    ExtractFormSchemaValidation<S>
  >({} as ExtractFormSchemaValidation<S>);
  const newsletterParams = useNewsletterTracking();

  const [shouldHide, setShouldHide] = useState<boolean>(false);

  const postOpportunity = useCallback(
    async (
      fields: ExtractFormSchemaValidation<S>,
      closeModal,
      adminCallback
    ) => {
      const { openNewForm, department, address, ...opportunity } = fields;
      const candidatesIds = opportunity.candidatesIds
        ? opportunity.candidatesIds.map((candidateId) => {
            return candidateId.value;
          })
        : [];

      let successMessage = 'Offre validée';
      if (!isAdmin) {
        if (opportunity.isPublic) {
          gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_CLIC);
          fbEvent(FB_TAGS.COMPANY_GENERAL_OFFER_SEND);
        } else if (candidatesIds.length > 1) {
          gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_MULTIPLE_CLIC);
          fbEvent(FB_TAGS.COMPANY_CV_OFFER_SEND);
        } else {
          gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_UNIQUE_CLIC);
          fbEvent(FB_TAGS.COMPANY_CV_OFFER_SEND);
        }
        successMessage = opportunity.isPublic
          ? 'Merci pour votre offre, nous reviendrons bientôt vers vous.'
          : `Merci pour votre offre, le(s) candidat(s) et coach(s) associés reviendront bientôt vers vous.`;
      }

      const locations =
        'locations' in fields && fields.locations.length > 0
          ? {
              locations: fields.locations.map(
                ({
                  department: locationDepartment,
                  address: locationAddress,
                }) => {
                  return {
                    department: locationDepartment.value,
                    address: locationAddress,
                  };
                }
              ),
            }
          : { department: department.value, address };

      const startEndContract =
        'startOfContract' in fields && 'endOfContract' in fields
          ? {
              startOfContract: fields.startOfContract,
              endOfContract: fields.endOfContract,
            }
          : {};

      try {
        await Api.postOpportunity({
          ...opportunity,
          ...locations,
          ...startEndContract,
          candidatesIds:
            opportunity.isPublic && !isAdmin ? null : candidatesIds,
          message: opportunity.isPublic ? null : opportunity.message,
          recruiterPhone: opportunity.recruiterPhone || null,
          ...('businessLines' in fields
            ? {
                businessLines: fields.businessLines.map(
                  (businessLine, index) => {
                    return {
                      name: businessLine.value,
                      order: index,
                    };
                  }
                ),
              }
            : {}),
          date: moment().toISOString(),
          ...newsletterParams,
        });
        UIkit.notification(successMessage, 'success');
        if (adminCallback) await adminCallback();
        if (openNewForm) {
          setShouldHide(true);
          setLastFilledForm({
            ...fields,
            candidatesIds: [],
          });
          setTimeout(() => {
            setShouldHide(false);
          }, 1000);
        } else {
          closeModal();
          setLastFilledForm({} as ExtractFormSchemaValidation<S>);
        }
      } catch (err) {
        UIkit.notification(`Une erreur est survenue.`, 'danger');
      }
    },
    [isAdmin, newsletterParams]
  );

  const modalProps = useMemo(() => {
    return {
      title: modalTitle,
      description: modalDesc,
      submitText: isAdmin ? 'Valider' : 'Envoyer',
      defaultValues: {
        ...defaultValues,
        ...lastFilledForm,
        shouldSendNotifications: true,
      },
      formSchema,
      onError: (fields) => {
        if (!isAdmin) {
          if (fields.isPublic) {
            gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_INVALIDE);
          } else if (fields.candidatesIds?.length > 1) {
            gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_MULTIPLE_INVALIDE);
          } else {
            gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_UNIQUE_INVALIDE);
          }
        }
      },
      onSubmit: async (fields, closeModal) => {
        await postOpportunity(
          isAdmin
            ? {
                ...fields,
                isAdmin: true,
              }
            : fields,
          closeModal,
          callback
        );
      },
    };
  }, [
    callback,
    defaultValues,
    formSchema,
    isAdmin,
    lastFilledForm,
    modalDesc,
    modalTitle,
    postOpportunity,
  ]);

  return !shouldHide && <ModalEdit {...modalProps} />;
}
