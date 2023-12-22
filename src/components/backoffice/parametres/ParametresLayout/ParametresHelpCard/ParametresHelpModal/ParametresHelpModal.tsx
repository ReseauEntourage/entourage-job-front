import React from 'react';
import { useProfile } from '../../../useUpdateProfile';
import { StyledHelpModalSelectOption } from '../ParametresHelpCard.styles';
import { PARAMETRES_HELP_CARD_CONTENTS } from '../ParametresHelpCard.utils';
import { FormFooter } from 'src/components/forms/FormFooter';
import { useModalContext } from 'src/components/modals/Modal';
import { H6 } from 'src/components/utils/Headings';
import { SelectList } from 'src/components/utils/Inputs/SelectList';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

export const ParametresHelpModal = () => {
  const { onClose } = useModalContext();
  const user = useAuthenticatedUser();
  const { userProfile } = user;

  const { helpField, updateUserProfile, setTempProfile } = useProfile(
    user,
    onClose
  );

  if (!helpField || !userProfile) return null;
  return (
    <>
      <SelectList
        id="help-select-list"
        onChange={(values) => {
          setTempProfile({
            [helpField]: values.map((help) => {
              return { name: help };
            }),
          });
        }}
        defaultValues={userProfile[helpField].map(({ name }) => name)}
        options={PARAMETRES_HELP_CARD_CONTENTS[user.role.toLowerCase()].map(
          ({ value, title, description, icon }) => ({
            value,
            component: (
              <StyledHelpModalSelectOption>
                <div className="img-container">{icon}</div>
                <div className="text-container">
                  <H6 title={title} color="primaryOrange" />
                  <p>{description}</p>
                </div>
              </StyledHelpModalSelectOption>
            ),
          })
        )}
      />
      <FormFooter
        onCancel={onClose}
        onSubmit={updateUserProfile}
        submitText="Sauvegarder"
        formId=""
        noCompulsory
      />
    </>
  );
};
