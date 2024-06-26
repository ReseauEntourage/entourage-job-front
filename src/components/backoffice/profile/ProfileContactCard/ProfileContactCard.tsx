import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AvionPapier, Check } from 'assets/icons/icons';
import { useIsProfileContacted } from '../usIsProfileContacted';
import { useSelectSelectedProfile } from '../useSelectedProfile';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formContactInternalMessage } from 'src/components/forms/schemas/formContactInternalMessage';
import { Card } from 'src/components/utils';
import { ReduxRequestEvents } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { notificationsActions } from 'src/use-cases/notifications';
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
  useEffect(
    () => () => {
      dispatch(profilesActions.postInternalMessageReset());
    },
    [dispatch]
  );

  useEffect(() => {
    if (postInternalMessageStatus === ReduxRequestEvents.SUCCEEDED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: `Le message a bien été envoyé`,
        })
      );
      setIsFormSent(true);
      setLoadingSending(false);
    } else if (postInternalMessageStatus === ReduxRequestEvents.FAILED) {
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message: `Une erreur est survenue`,
        })
      );
      setLoadingSending(false);
    }
  }, [postInternalMessageStatus, dispatch]);

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
        {selectedProfile.isAvailable ? (
          <>
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
                        message: values.message,
                        subject: values.subject.value,
                        addresseeUserId: selectedProfile?.id,
                      })
                    );
                  }}
                  defaultValues={{ selectedProfileType: selectedProfile?.role }}
                  noCompulsory
                />
              </>
            )}
          </>
        ) : (
          <StyledContactMessage>
            {selectedProfile.firstName} n&apos;est pas disponible pour le moment
            pour recevoir des demandes de contact
          </StyledContactMessage>
        )}
      </StyledProfileContactForm>
    </Card>
  );
};
