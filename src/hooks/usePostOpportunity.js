import UIkit from 'uikit';

import React, { memo, useCallback, useEffect, useState } from 'react';
import Api from 'src/Axios';
import _ from 'lodash';
import { usePrevious } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import { FB_TAGS, GA_TAGS } from 'src/constants/tags';
import { openModal } from 'src/components/modals/Modal';
import defaultSchema from 'src/components/forms/schema/formEditOpportunity';
import ModalEdit from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { findConstantFromValue, getValueFromFormField } from 'src/utils';
import { BUSINESS_LINES } from 'src/constants';
import { fbEvent } from 'src/lib/fb';

export function usePostOpportunity({
  modalTitle,
  modalDesc,
  isAdmin,
  candidateId,
  callback,
  defaultValues = {},
  schema = defaultSchema,
}) {
  const [lastFilledForm, setLastFilledForm] = useState({});

  const prevLastFilledForm = usePrevious(lastFilledForm);

  const postOpportunity = useCallback(
    async (fields, closeModal, adminCallback) => {
      const { openNewForm, ...opportunity } = fields;
      const candidatesId = opportunity.candidatesId
        ? opportunity.candidatesId.map((id) => {
            return typeof id === 'object' ? id.value : id;
          })
        : [];

      let successMessage = 'Offre validée';
      if (!isAdmin) {
        if (opportunity.isPublic) {
          gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_CLIC);
          fbEvent(FB_TAGS.COMPANY_GENERAL_OFFER);
        } else if (candidatesId.length > 1) {
          gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_MULTIPLE_CLIC);
          fbEvent(FB_TAGS.COMPANY_CV_OFFER);
        } else {
          gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_UNIQUE_CLIC);
          fbEvent(FB_TAGS.COMPANY_CV_OFFER);
        }
        successMessage = opportunity.isPublic
          ? 'Merci pour votre offre, nous reviendrons bientôt vers vous.'
          : `Merci pour votre offre, le(s) candidat(s) et coach(s) associés reviendront bientôt vers vous.`;
      }

      try {
        await Api.post(`/opportunity/`, {
          ...opportunity,
          startOfContract: opportunity.startOfContract || null,
          endOfContract: opportunity.endOfContract || null,
          candidatesId: opportunity.isPublic && !isAdmin ? null : candidatesId,
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
          date: Date.now(),
        });
        closeModal();
        UIkit.notification(successMessage, 'success');
        if (adminCallback) await adminCallback();
        if (openNewForm) {
          setLastFilledForm({
            ...fields,
            candidatesId: [],
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
    [isAdmin]
  );

  const PostOpportunityModal = memo(() => {
    const mutatedDefaultValue = {
      ...defaultValues,
      candidatesId: defaultValues.candidat
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

    return (
      <ModalEdit
        title={modalTitle}
        description={modalDesc}
        submitText={isAdmin ? 'Valider' : 'Envoyer'}
        defaultValues={{
          ...mutatedDefaultValue,
          ...lastFilledForm,
          candidatesId: mutatedDefaultValue.candidatesId,
          shouldSendNotifications: true,
        }}
        formSchema={schema}
        onError={async (fields) => {
          if (!isAdmin) {
            if (fields.isPublic) {
              gaEvent(GA_TAGS.POPUP_OFFRE_ENVOYER_OFFRE_GENERALE_INVALIDE);
            } else if (fields.candidatesId?.length > 1) {
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
  }, [
    defaultValues,
    modalTitle,
    modalDesc,
    lastFilledForm,
    schema,
    candidateId,
    postOpportunity,
    isAdmin,
    callback,
  ]);

  useEffect(() => {
    if (!_.isEmpty(lastFilledForm) && lastFilledForm !== prevLastFilledForm) {
      setTimeout(() => {
        openModal(<PostOpportunityModal />);
      }, 1000);
    }
  }, [lastFilledForm, PostOpportunityModal, prevLastFilledForm]);

  return {
    PostOpportunityModal,
  };
}
