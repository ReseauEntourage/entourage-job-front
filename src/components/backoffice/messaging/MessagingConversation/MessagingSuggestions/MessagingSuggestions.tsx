import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IlluConversation } from 'assets/icons/icons';
import { H3 } from 'src/components/utils/Headings/H3';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { messagingActions, selectNewMessage } from 'src/use-cases/messaging';
import { Item } from './Item/Item';
import {
  MessagingSuggestionsContainer,
  MessagingSuggestionsExplanation,
  MessagingSuggestionsListContainer,
} from './MessagingSuggestions.styles';
import { MessagingSuggestionItem } from './MessagingSuggestions.types';

export const MessagingSuggestions = () => {
  const dispatch = useDispatch();
  const newMessage = useSelector(selectNewMessage);
  const currentUser = useSelector(selectCurrentUser);

  const suggestions = useMemo(() => {
    if (!currentUser) {
      return [];
    }
    return [
      {
        name: 'Améliorer mes candidatures',
        message: `Bonjour, je suis ${currentUser.firstName},\nJe cherche des conseils pour trouver un emploi. Pouvez-vous m’aider à améliorer mon CV et mes candidatures ?\nMerci d'avance`,
      },
      {
        name: 'Préparer un entretien',
        message: `Bonjour, je suis ${currentUser.firstName},\nJ’ai passé un entretien récemment, mais je ne suis pas sûr de ma prestation. Pouvez-vous m’aider à m’améliorer pour les prochains ?\nMerci d'avance`,
      },
      {
        name: "M'orienter professionnellement",
        message: `Bonjour, je suis ${currentUser.firstName},\nJ’aimerais discuter de mon orientation professionnelle. Comment choisir un métier qui correspond à mes compétences et mes envies ?\nMerci d'avance`,
      },
      {
        name: "M'organiser pour mes recherches",
        message: `Bonjour, je suis ${currentUser.firstName},\nJe veux organiser ma recherche d’emploi plus efficacement. Avez-vous des conseils pour mieux planifier mes démarches ?\nMerci d'avance`,
      },
      {
        name: 'Comprendre le marché du travail',
        message: `Bonjour, je suis ${
          currentUser.firstName
        },\nPourriez-vous m’en dire plus sur les métiers qui recrutent dans mon secteur ${
          currentUser.userProfile?.department
            ? `- ${currentUser.userProfile.department}`
            : ''
        } ? Je veux maximiser mes chances.\nMerci d'avance`,
      },
    ] as MessagingSuggestionItem[];
  }, [currentUser]);

  const bindSelectedSuggestion = (suggestion: MessagingSuggestionItem) => {
    dispatch(messagingActions.setNewMessage(suggestion.message));
  };

  return (
    <MessagingSuggestionsContainer>
      {newMessage.length <= 0 && (
        <>
          <MessagingSuggestionsExplanation>
            <IlluConversation width="226" height="226" />
            <H3 title="Vous avez besoin d’aide pour vous lancer ?" center />
            <p>
              Choisissez un sujet ci-dessous et envoyez votre premier message en
              toute simplicité
            </p>
          </MessagingSuggestionsExplanation>
          <MessagingSuggestionsListContainer>
            {suggestions.map((suggestion) => (
              <Item
                key={suggestion.name}
                suggestion={suggestion}
                onClick={() => {
                  bindSelectedSuggestion(suggestion);
                }}
              />
            ))}
          </MessagingSuggestionsListContainer>
        </>
      )}
    </MessagingSuggestionsContainer>
  );
};
