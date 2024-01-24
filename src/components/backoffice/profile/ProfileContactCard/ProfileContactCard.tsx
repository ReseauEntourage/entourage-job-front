import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { useSelectedProfile } from '../useSelectedProfile';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formContactInternalMessage } from 'src/components/forms/schemas/formContactInternalMessage';
import { Card } from 'src/components/utils';
import { ReduxRequestEvents } from 'src/constants';
import { usePrevious } from 'src/hooks/utils';
import {
  postInternalMessageSelectors,
  profilesActions,
} from 'src/use-cases/profiles';
import { StyledProfileContactForm } from './ProfileContactCard.styles';

export const ProfileContactCard = () => {
  const { selectedProfile } = useSelectedProfile();
  const [isFormSent, setIsFormSent] = useState(false);
  const [loadingSending, setLoadingSending] = useState(false);
  const dispatch = useDispatch();
  const postInternalMessageStatus = useSelector(
    postInternalMessageSelectors.selectPostInternalMessageStatus
  );
  const prevPostInternalMessageStatus = usePrevious(postInternalMessageStatus);

  useEffect(() => {
    if (prevPostInternalMessageStatus === ReduxRequestEvents.REQUESTED) {
      if (postInternalMessageStatus === ReduxRequestEvents.SUCCEEDED) {
        UIkit.notification('Le message a bien été envoyé', 'success');
        setIsFormSent(true);
        setLoadingSending(false);
      } else if (postInternalMessageStatus === ReduxRequestEvents.FAILED) {
        UIkit.notification('Une erreur est survenue', 'danger');
        setLoadingSending(false);
      }
    }
  }, [postInternalMessageStatus, prevPostInternalMessageStatus]);

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
            onSubmit={async (values) => {
              if (!selectedProfile) return null;
              dispatch(
                profilesActions.postInternalMessageRequested({
                  ...values,
                  addresseeUserId: selectedProfile?.id,
                })
              );
            }}
            noCompulsory
          />
        )}
      </StyledProfileContactForm>
    </Card>
  );
};
