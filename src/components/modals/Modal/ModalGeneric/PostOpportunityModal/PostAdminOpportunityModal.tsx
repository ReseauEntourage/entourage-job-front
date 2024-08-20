import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formAddOpportunityAsAdmin } from 'src/components/forms/schemas/formAddOpportunity';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { notificationsActions } from 'src/use-cases/notifications';

interface PostAdminOpportunityModalProps {
  callback?: () => void;
}
export function PostAdminOpportunityModal({
  callback,
}: PostAdminOpportunityModalProps) {
  const dispatch = useDispatch();
  const [lastFilledForm, setLastFilledForm] = useState<
    ExtractFormSchemaValidation<typeof formAddOpportunityAsAdmin>
  >({} as ExtractFormSchemaValidation<typeof formAddOpportunityAsAdmin>);

  const [shouldHide, setShouldHide] = useState<boolean>(false);

  const postOpportunity = useCallback(
    async (
      fields: ExtractFormSchemaValidation<typeof formAddOpportunityAsAdmin>,
      closeModal,
      adminCallback
    ) => {
      const { openNewForm, department, address, ...opportunity } = fields;

      const candidatesIds = opportunity.candidatesIds
        ? opportunity.candidatesIds.map((candidateId) => {
            return candidateId.value;
          })
        : [];

      const successMessage = 'Offre validée';

      try {
        await Api.postOpportunity({
          ...opportunity,
          department: department.value,
          startOfContract: fields.startOfContract,
          endOfContract: fields.endOfContract,
          candidatesIds,
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          message: opportunity.isPublic ? null : opportunity.message,
          // @ts-expect-error after enable TS strict mode. Please, try to fix it
          recruiterPhone: opportunity.recruiterPhone || null,
          businessLines: fields.businessLines.map((businessLine, index) => {
            return {
              name: businessLine.value,
              order: index,
            };
          }),
          date: moment().toISOString(),
        });

        dispatch(
          notificationsActions.addNotification({
            type: 'success',
            message: successMessage,
          })
        );
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

          setLastFilledForm(
            {} as ExtractFormSchemaValidation<typeof formAddOpportunityAsAdmin>
          );
        }
      } catch (err) {
        dispatch(
          notificationsActions.addNotification({
            type: 'danger',
            message: "Une erreur s'est produite",
          })
        );
      }
    },
    [dispatch]
  );

  const modalProps = useMemo(() => {
    return {
      title: 'Ajouter une nouvelle offre',
      submitText: 'Valider',
      defaultValues: {
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        isPublic: true,
        ...lastFilledForm,
        shouldSendNotifications: true,
      },
      formSchema: formAddOpportunityAsAdmin,
      onSubmit: async (fields, closeModal) => {
        await postOpportunity(
          {
            ...fields,
            isAdmin: true,
          },
          closeModal,
          callback
        );
      },
    };
  }, [callback, lastFilledForm, postOpportunity]);

  return !shouldHide && <ModalEdit {...modalProps} />;
}
