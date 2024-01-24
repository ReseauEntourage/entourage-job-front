import React, { useState } from 'react';
import UIkit from 'uikit';
import { useSelectedProfile } from '../useSelectedProfile';
import { Api } from 'src/api';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formContactInternalMessage } from 'src/components/forms/schemas/formContactInternalMessage';
import { Card } from 'src/components/utils';
import { StyledProfileContactForm } from './ProfileContactCard.styles';

export const ProfileContactCard = () => {
  const { selectedProfile } = useSelectedProfile();
  const [isFormSent, setIsFormSent] = useState(false);
  const [loadingSending, setLoadingSending] = useState(false);

  return (
    <Card
      title={`Prenez contact avec ${selectedProfile?.firstName}`}
      isLoading={loadingSending}
    >
      <StyledProfileContactForm>
        {isFormSent ? (
          <div>Message envoyé</div>
        ) : (
          <FormWithValidation
            formSchema={formContactInternalMessage}
            onSubmit={async (values, setError) => {
              if (!selectedProfile) return null;
              setLoadingSending(true);
              try {
                await Api.postInternalMessage({
                  ...values,
                  addresseeUserId: selectedProfile?.id,
                });
                setError('');
                setLoadingSending(false);
                UIkit.notification('Le message a bien été envoyé', 'success');
                setIsFormSent(true);
              } catch (err) {
                console.error(err);
                setLoadingSending(false);
                setError('Une erreur est survenue');
              }
            }}
            noCompulsory
          />
        )}
      </StyledProfileContactForm>
    </Card>
  );
};
