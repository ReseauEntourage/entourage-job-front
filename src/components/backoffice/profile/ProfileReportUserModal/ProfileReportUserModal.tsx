import React, { useCallback, useMemo } from 'react';
import { useOnReportUserFormSubmit } from '../useOnReportUserFormSubmit';
import { Api } from 'src/api';
import { UserReportDto } from 'src/api/types';
import { formReportUser } from 'src/components/forms/schemas/formReportUser';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Actions } from 'src/constants/utils';

type ProfileReportUserModalProps = {
  userId: string;
};

export const ProfileReportUserModal = ({
  userId,
}: ProfileReportUserModalProps) => {
  const { onSubmit } = useOnReportUserFormSubmit(
    async (userReportDto: UserReportDto) => {
      return Api.postProfileUserAbuse(userId, userReportDto);
    },
    Actions.CREATE
  );

  const handleReportUserSubmit = useCallback(
    async (fields, closeModal) => {
      await onSubmit(fields, closeModal);
    },
    [onSubmit]
  );

  const updateUserModalProps = useMemo(() => {
    return {
      formId: 'id',
      formSchema: formReportUser,
      title: 'Signaler un utilisateur',
      description:
        'Vous pouvez signaler un utilisateur si vous pensez qu’il ne respecte pas les règles de la plateforme.',
      submitText: 'Envoyer',
      cancelText: 'Annuler',
      onSubmit: handleReportUserSubmit,
      defaultValues: {
        reason: '',
        comment: '',
      },
    };
  }, [handleReportUserSubmit]);

  return <ModalEdit {...updateUserModalProps} />;
};
