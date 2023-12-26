import React from 'react';
import { useProfile } from '../../../useUpdateProfile';
import { StyledHelpModalSelectOption } from '../ParametresHelpCard.styles';
import { PARAMETRES_HELP_CARD_CONTENTS } from '../ParametresHelpCard.utils';
import { useModalContext } from 'src/components/modals/Modal';
import { Button } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { SelectList } from 'src/components/utils/Inputs/SelectList';
import { UserRole } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { StyledParametresHelpModalCTAContainer } from './StyledParametresHelpModal.styles';

export const ParametresHelpModal = ({ role }: { role: UserRole }) => {
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
        options={PARAMETRES_HELP_CARD_CONTENTS[role.toLowerCase()].map(
          ({ value, title, description, icon }) => ({
            value,
            component: (
              <StyledHelpModalSelectOption
                data-testid={`parametres-help-option-${value}`}
              >
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
      <StyledParametresHelpModalCTAContainer>
        <Button
          style="custom-secondary"
          color="primaryOrange"
          onClick={onClose}
        >
          Annuler
        </Button>
        <Button
          style="custom-secondary-inverted"
          onClick={updateUserProfile}
          dataTestId="parametres-help-modal-save"
        >
          Sauvegarder
        </Button>
      </StyledParametresHelpModalCTAContainer>
    </>
  );
};
