import React from 'react';
import { useDispatch } from 'react-redux';
import { ProfilePartCard } from '../Card/Card/Card';
import { Api } from 'src/api';
import { FormWithValidation } from 'src/features/forms/FormWithValidation';
import { formChangePassword } from 'src/features/forms/schemas/formChangePassword';
import { useResetForm } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';

export const ProfileChangePassword = () => {
  const [form, resetForm] = useResetForm();

  const dispatch = useDispatch();
  return (
    <ProfilePartCard
      title="Votre mot de passe"
      isCompleted
      isDefaultOpen={false}
    >
      <FormWithValidation
        innerRef={form}
        submitText="Modifier"
        submitBtnVariant="secondary"
        formSchema={formChangePassword}
        onSubmit={async ({ newPassword, oldPassword }, setError) => {
          try {
            await Api.putUserChangePwd({
              newPassword,
              oldPassword,
            });
            dispatch(
              notificationsActions.addNotification({
                type: 'success',
                message: 'Nouveau mot de passe enregistré',
              })
            );
            resetForm();
            setError('');
          } catch (err) {
            console.error(err);
            setError("L'ancien mot de passe n'est pas valide");
          }
        }}
      />
    </ProfilePartCard>
  );
};
