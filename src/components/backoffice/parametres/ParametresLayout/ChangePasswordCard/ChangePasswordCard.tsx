import React, { useState } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formChangePassword } from 'src/components/forms/schemas/formChangePassword';
import { Card } from 'src/components/utils';
import { useResetForm } from 'src/hooks/utils';
import { PasswordCriterias } from './PasswordCriterias';

export const ChangePasswordCard = () => {
  const [form, resetForm] = useResetForm();

  const [loadingPassword, setLoadingPassword] = useState(false);

  return (
    <Card
      title="Modification du mot de passe"
      isLoading={loadingPassword}
      isMobileClosable
    >
      <PasswordCriterias />
      <FormWithValidation
        innerRef={form}
        submitText="Modifier"
        formSchema={formChangePassword}
        onSubmit={async ({ newPassword, oldPassword }, setError) => {
          setLoadingPassword(true);
          try {
            await Api.putUserChangePwd({
              newPassword,
              oldPassword,
            });
            UIkit.notification('Nouveau mot de passe enregistré', 'success');
            resetForm();
            setError('');
            setLoadingPassword(false);
          } catch (err) {
            console.error(err);
            setError("L'ancien mot de passe n'est pas valide");
            setLoadingPassword(false);
          }
        }}
      />
    </Card>
  );
};
