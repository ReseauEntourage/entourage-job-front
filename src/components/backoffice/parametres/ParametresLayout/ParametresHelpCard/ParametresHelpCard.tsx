import React from 'react';
import { useHelpField } from '../../useUpdateProfile';
import { openModal } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { Card } from 'src/components/utils';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import {
  StyledHelpCardList,
  StyledHelpCardImgContainer,
} from './ParametresHelpCard.styles';
import {
  PARAMETRES_HELP_CARD_TITLES,
  PARAMETRES_HELP_CARD_CONTENTS,
} from './ParametresHelpCard.utils';
import { ParametresHelpModal } from './ParametresHelpModal';

export const ParametresHelpCard = () => {
  const user = useAuthenticatedUser();

  const { role, userProfile } = user;

  const helpField = useHelpField(user);

  const openHelpEditModal = () => {
    openModal(
      <ModalGeneric
        title={PARAMETRES_HELP_CARD_TITLES.modal[role.toLowerCase()]}
      >
        <ParametresHelpModal />
      </ModalGeneric>
    );
  };

  if (!helpField || !userProfile) return null;

  return (
    <Card
      title={PARAMETRES_HELP_CARD_TITLES.card[role.toLowerCase()]}
      editCallback={openHelpEditModal}
      isMobileClosable
    >
      <StyledHelpCardList>
        {PARAMETRES_HELP_CARD_CONTENTS[role.toLowerCase()].map(
          ({ icon, title, value }, index) => {
            if (!userProfile[helpField].some((help) => help.name === value)) {
              return null;
            }
            return (
              <li key={index}>
                <StyledHelpCardImgContainer>{icon}</StyledHelpCardImgContainer>
                {title}
              </li>
            );
          }
        )}
      </StyledHelpCardList>
    </Card>
  );
};
