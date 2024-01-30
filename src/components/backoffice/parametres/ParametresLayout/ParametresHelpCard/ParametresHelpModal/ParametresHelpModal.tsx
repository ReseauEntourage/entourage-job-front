import React, { useEffect, useState } from 'react';
import { useUpdateProfile } from '../../../useUpdateProfile';
import { StyledHelpModalSelectOption } from '../ParametresHelpCard.styles';
import { UserProfile } from 'src/api/types';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { SelectList } from 'src/components/utils/Inputs/SelectList';
import { ParametresHelpCardContents } from 'src/constants/helps';
import { UserRole } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { StyledParametresHelpModalCTAContainer } from './StyledParametresHelpModal.styles';

export const ParametresHelpModal = ({
  role,
  title,
}: {
  role: UserRole;
  title: string;
}) => {
  const { onClose } = useModalContext();
  const user = useAuthenticatedUser();
  const { userProfile } = user;

  const { helpField, updateUserProfile, closeModal } = useUpdateProfile(user);

  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    if (helpField && userProfile) {
      setTempProfile(userProfile);
    }
  }, [helpField, userProfile]);

  if (!helpField || !tempProfile || !(helpField in tempProfile)) return null;
  return (
    <ModalGeneric title={title} closeOnNextRender={closeModal}>
      <SelectList
        id="help-select-list"
        onChange={(values) => {
          setTempProfile({
            [helpField]: values.map((help) => {
              return { name: help };
            }),
          });
        }}
        values={
          tempProfile[helpField]
            ? tempProfile[helpField]?.map(({ name }) => name)
            : []
        }
        options={ParametresHelpCardContents[role].map(
          ({ value, title: titleH6, description, icon }) => ({
            value,
            component: (
              <StyledHelpModalSelectOption
                data-testid={`parametres-help-option-${value}`}
              >
                <div className="img-container">{icon}</div>
                <div className="text-container">
                  <H6 title={titleH6} color="primaryOrange" />
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
          onClick={() => updateUserProfile(tempProfile)}
          dataTestId="parametres-help-modal-save"
        >
          Sauvegarder
        </Button>
      </StyledParametresHelpModalCTAContainer>
    </ModalGeneric>
  );
};
