import React from 'react';
import { useDispatch } from 'react-redux';
import { ProfilePartCard } from '../Card/Card/Card';
import { Api } from 'src/api';
import { PasswordCriterias } from 'src/components/backoffice/parametres-old/ParametresLayout/ChangePasswordCard/PasswordCriterias';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formChangePassword } from 'src/components/forms/schemas/formChangePassword';
import { useResetForm } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';

export interface ProfileChangePasswordProps {
  smallCard?: boolean;
}

export const ProfileChangePassword = ({
  smallCard,
}: ProfileChangePasswordProps) => {
  const [form, resetForm] = useResetForm();

  const dispatch = useDispatch();
  return (
    <ProfilePartCard
      title="Votre mot de passe"
      smallCard={smallCard}
      isCompleted
    >
      <PasswordCriterias />
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
