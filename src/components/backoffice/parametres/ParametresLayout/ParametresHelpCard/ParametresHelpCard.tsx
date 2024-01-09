import React, { useEffect, useState } from 'react';
import PlaceholderIllu from 'assets/icons/illu-coeur-mains-ouvertes.svg';
import { useHelpField, helpFields } from '../../useUpdateProfile';
import { ParametresPlaceholder } from '../ParametresPlaceholder';
import { openModal } from 'src/components/modals/Modal';
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

const plaholderText = {
  title: {
    [helpFields.HELP_NEEDS]: 'Vous n’avez renseigné aucune demande d’entraide',
    [helpFields.HELP_OFFERS]:
      'Vous n’avez renseigné aucune proposition d’entraide',
  },
  description: {
    [helpFields.HELP_NEEDS]:
      'Grâce à ces informations, nous pourrons vous mettre en contact avec des coachs qui pourraient vous accompagner.',
    [helpFields.HELP_OFFERS]:
      'Grâce à ces informations, nous pourrons vous mettre en contact avec des candidats que vous pourrez accompagner.',
  },
} as const;

export const ParametresHelpCard = () => {
  const user = useAuthenticatedUser();

  const { role, userProfile } = user;

  const helpField = useHelpField(user);

  const [contextualRole, setContextualRole] = useState(role);
  useEffect(() => {
    setContextualRole(role === 'Candidat externe' ? 'Candidat' : role);
  }, [role]);

  const openHelpEditModal = () => {
    openModal(
      <ParametresHelpModal
        role={contextualRole}
        title={PARAMETRES_HELP_CARD_TITLES.modal[contextualRole.toLowerCase()]}
      />
    );
  };

  if (!helpField || !userProfile) return null;

  return (
    <Card
      title={PARAMETRES_HELP_CARD_TITLES.card[contextualRole.toLowerCase()]}
      editCallback={openHelpEditModal}
      isMobileClosable
      dataTestId="parametres-help-card"
    >
      {userProfile[helpField].length > 0 ? (
        <StyledHelpCardList data-testid="parametres-help-list">
          {PARAMETRES_HELP_CARD_CONTENTS[contextualRole.toLowerCase()].map(
            ({ icon, title, value }, index) => {
              if (!userProfile[helpField].some((help) => help.name === value)) {
                return null;
              }
              return (
                <li key={index}>
                  <StyledHelpCardImgContainer>
                    {icon}
                  </StyledHelpCardImgContainer>
                  {title}
                </li>
              );
            }
          )}
        </StyledHelpCardList>
      ) : (
        <ParametresPlaceholder
          image={<PlaceholderIllu />}
          title={plaholderText.title[helpField]}
          description={plaholderText.description[helpField]}
          onClick={openHelpEditModal}
        />
      )}
    </Card>
  );
};
