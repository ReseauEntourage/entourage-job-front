import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import { AvionPapier, Check } from 'assets/icons/icons';
import { useIsProfileContacted } from '../usIsProfileContacted';
import { useSelectSelectedProfile } from '../useSelectedProfile';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formContactInternalMessage } from 'src/components/forms/schemas/formContactInternalMessage';
import { Card } from 'src/components/utils';
import { ReduxRequestEvents } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { usePrevious } from 'src/hooks/utils';
import { gaEvent } from 'src/lib/gtag';
import {
  postInternalMessageSelectors,
  profilesActions,
} from 'src/use-cases/profiles';
import {
  StyledConfirmCheck,
  StyledContactMessage,
  StyledProfileContactForm,
} from './ProfileContactCard.styles';

export const ProfileContactCard = () => {
  const selectedProfile = useSelectSelectedProfile();
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
      dispatch(profilesActions.postInternalMessageReset());
    }
  }, [postInternalMessageStatus, prevPostInternalMessageStatus, dispatch]);

  const contactMessage = `Vous avez déjà contacté ${selectedProfile.firstName}`;
  const contactedMessage = `Vous avez déjà été contacté par ${selectedProfile.firstName}`;

  const { existingContactMessage } = useIsProfileContacted(
    selectedProfile,
    contactMessage,
    contactedMessage
  );

  return (
    <Card
      title={`Prenez contact avec ${selectedProfile?.firstName}`}
      isLoading={loadingSending}
    >
      <StyledProfileContactForm>
        {isFormSent ? (
          <div data-testid="profile-contact-form-confirm">
            <StyledConfirmCheck>
              <Check />
            </StyledConfirmCheck>
            Votre message a été envoyé
          </div>
        ) : (
          <>
            {existingContactMessage && (
              <StyledContactMessage>
                <AvionPapier />
                {existingContactMessage}
              </StyledContactMessage>
            )}
            <FormWithValidation
              formSchema={formContactInternalMessage}
              onSubmit={async (values) => {
                gaEvent(GA_TAGS.PROFILE_DETAILS_CONTACT_SEND_CLIC);
                dispatch(
                  profilesActions.postInternalMessageRequested({
                    ...values,
                    addresseeUserId: selectedProfile?.id,
                  })
                );
              }}
              noCompulsory
            />
          </>
        )}
      </StyledProfileContactForm>
    </Card>
  );
};
