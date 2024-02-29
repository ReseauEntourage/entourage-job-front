import React, { useEffect, useState } from 'react';
import { useUpdateProfile } from '../../../useUpdateProfile';
import { UserProfile } from 'src/api/types';
import { useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Button } from 'src/components/utils';
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
        name="help-select-list"
        onChange={(values) => {
          setTempProfile({
            [helpField]: values.map((help) => {
              return { name: help };
            }),
          });
        }}
        value={tempProfile[helpField]?.map(({ name }) => name) || []}
        options={ParametresHelpCardContents[role]}
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
