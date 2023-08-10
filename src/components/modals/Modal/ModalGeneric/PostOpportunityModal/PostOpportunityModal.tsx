import moment from 'moment';
import React, {
  /* memo, */ useCallback,
  /* useEffect, */ useState,
} from 'react';
import UIkit from 'uikit';

import { Api } from 'src/api';
import { formEditOpportunity as defaultSchema } from 'src/components/forms/schemas/formEditOpportunity';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { BUSINESS_LINES } from 'src/constants';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { useNewsletterTracking } from 'src/hooks/useNewsletterTracking';
import { fbEvent } from 'src/lib/fb';
import { gaEvent } from 'src/lib/gtag';
import { findConstantFromValue, getValueFromFormField } from 'src/utils';
import { AnyToFix } from 'src/utils/Types';

interface PostOpportunityModalProps {
  modalTitle: string;
  modalDesc: string | JSX.Element;
  isAdmin?: boolean;
  candidateId?: string;
  callback?: () => void;
  defaultValues: AnyToFix; // to be typed
  schema?: AnyToFix; // to be typed
}

export const PostOpportunityModal = ({
  modalTitle,
  modalDesc,
  isAdmin = false,
  candidateId,
  callback,
  defaultValues = {},
  schema = defaultSchema,
}: PostOpportunityModalProps) => {
  const [lastFilledForm, setLastFilledForm] = useState({});
  // const prevLastFilledForm = usePrevious(lastFilledForm);
  const newsletterParams = useNewsletterTracking();

  const mutatedDefaultValue = {
    ...defaultValues,
    candidatesIds: defaultValues.candidat
      ? [
          {
            label: `${defaultValues.candidat.firstName} ${defaultValues.candidat.lastName}`,
            value: candidateId,
          },
        ]
      : [],
    businessLines: defaultValues.businessLines
      ? defaultValues.businessLines.map((businessLine) => {
          return findConstantFromValue(businessLine, BUSINESS_LINES);
        })
      : [],
  };

  const postOpportunity = useCallback(
    async (fields, closeModal, adminCallback) => {
      const { openNewForm, ...opportunity } = fields;
      const candidatesIds = opportunity.candidatesIds
        ? opportunity.candidatesIds.map((id) => {
            return typeof id === 'object' ? id.value : id;
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

      try {
        await Api.postOpportunity({
          ...opportunity,
          startOfContract: opportunity.startOfContract || null,
          endOfContract: opportunity.endOfContract || null,
          candidatesIds:
            opportunity.isPublic && !isAdmin ? null : candidatesIds,
          message: opportunity.isPublic ? null : opportunity.message,
          recruiterPhone: opportunity.recruiterPhone || null,
          businessLines: opportunity.businessLines
            ? opportunity.businessLines.map((businessLine, index) => {
                return {
                  name: businessLine,
                  order: index,
                };
              })
            : undefined,
          locations: opportunity.locations.map(({ department, address }) => {
            return {
              department: getValueFromFormField(department),
              address,
            };
          }),
          date: moment().toISOString(),
          ...newsletterParams,
        });
        closeModal();
        UIkit.notification(successMessage, 'success');
        if (adminCallback) await adminCallback();
        if (openNewForm) {
          setLastFilledForm({
            ...fields,
            candidatesIds: [],
            businessLines: fields.businessLines
              ? fields.businessLines.map((businessLine) => {
                  return findConstantFromValue(businessLine, BUSINESS_LINES);
                })
              : [],
          });
        } else {
          setLastFilledForm({});
        }
      } catch (err) {
        UIkit.notification(`Une erreur est survenue.`, 'danger');
      }
    },
    [isAdmin, newsletterParams]
  );

  // useEffect(() => {
  //     if (!_.isEmpty(lastFilledForm) && lastFilledForm !== prevLastFilledForm) {
  //       setTimeout(() => {
  //         openModal(<PostOpportunityModal />);
  //       }, 1000);
  //     }
  //   }, [lastFilledForm, PostOpportunityModal, prevLastFilledForm]);

  return (
    <ModalEdit
      title={modalTitle}
      description={modalDesc}
      submitText={isAdmin ? 'Valider' : 'Envoyer'}
      defaultValues={{
        ...mutatedDefaultValue,
        ...lastFilledForm,
        candidatesIds: mutatedDefaultValue.candidatesIds,
        shouldSendNotifications: true,
      }}
      formSchema={schema}
      onError={async (fields) => {
        if (!isAdmin) {
          if (fields.isPublic) {
            gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_INVALIDE);
          } else if (fields.candidatesIds?.length > 1) {
            gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_MULTIPLE_INVALIDE);
          } else {
            gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_UNIQUE_INVALIDE);
          }
        }
      }}
      onSubmit={async (fields, closeModal) => {
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
      }}
    />
  );
};
