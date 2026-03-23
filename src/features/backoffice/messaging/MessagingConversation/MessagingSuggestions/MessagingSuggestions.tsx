import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SvgIcon } from '@/assets/icons/icons';
import { ConversationParticipant } from '@/src/api/types';
import { H3 } from '@/src/components/ui/Headings/H3';
import { COLORS } from '@/src/constants/styles';
import { getRolesNotAdmin, UserRoles } from '@/src/constants/users';
import { isRoleIncluded } from '@/src/utils';
import { LucidIcon } from 'src/components/ui';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { Item } from './Item/Item';
import {
  MessagingQuickRepliesContainer,
  MessagingQuickRepliesListContainer,
  MessagingSuggestionsContainer,
  MessagingSuggestionsExplanation,
  MessagingSuggestionsListContainer,
} from './MessagingSuggestions.styles';
import { MessagingSuggestionItem } from './MessagingSuggestions.types';

export interface MessagingSuggestionProps {
  newMessage: string;
  onSuggestionClick: (suggestion: MessagingSuggestionItem) => void;
  participants: ConversationParticipant[];
  variant?: 'default' | 'coach-quick-replies';
}

export const MessagingSuggestions = ({
  newMessage,
  onSuggestionClick,
  participants,
  variant = 'default',
}: MessagingSuggestionProps) => {
  const currentUser = useSelector(selectCurrentUser);

  const suggestions = useMemo(() => {
    const participantsFirstNames = participants
      .map((p) => p.firstName)
      .join(', ');
    if (!currentUser) {
      return [];
    }

    if (variant === 'coach-quick-replies') {
      return [
        {
          name: "Proposer de l'aide",
          message: `Bonjour ${participantsFirstNames},\nMerci pour votre message.\nJe suis disponible pour échanger avec vous.\n\nPouvez-vous me préciser votre objectif actuel afin que nous organisions un premier échange ?`,
        },
        {
          name: 'Je ne suis pas disponible',
          message: `Bonjour ${participantsFirstNames},\nMerci pour votre message.\nJe ne suis pas disponible actuellement pour m'impliquer dans un nouvel échange.\nJe vous invite à contacter d'autres membres du réseau afin de poursuivre vos démarches.\nTous mes encouragements pour la suite.`,
        },
        {
          name: "Mon domaine d'activité est différent",
          message: `Bonjour ${participantsFirstNames},\nMerci pour votre message. Votre recherche ne correspond pas directement à mon domaine d'activité, ce qui limite ma capacité à vous aider efficacement.\n\nJe vous invite à contacter d'autres membres plus proches de votre secteur.\n\nBonne continuation dans vos démarches.`,
        },
      ] as MessagingSuggestionItem[];
    }

    if (currentUser.role === UserRoles.CANDIDATE) {
      // Suggestions for candidates
      return [
        {
          name: "J'ai besoin d'aide pour affiner mon projet professionnel",
          message: `Bonjour ${participantsFirstNames},\nJe m'appelle ${currentUser.firstName}, j'aimerais discuter de mon orientation professionnelle avec vous. Pourriez-vous m'aider ?\nMerci d'avance`,
        },
        {
          name: 'Commencer un premier CV et lettres de motivation',
          message: `Bonjour ${participantsFirstNames},\nJe m'appelle ${currentUser.firstName}, je suis en difficulté pour créer mon CV et des lettres de motivation.\nJe souhaiterais savoir si vous pourriez m'accompagner dans la rédaction et la mise en forme.\nMerci d'avance`,
        },
        {
          name: 'Relecture de mon CV et de ma lettre de motivation',
          message: `Bonjour ${participantsFirstNames},\nJe m'appelle ${currentUser.firstName}, je possède un CV et une lettre de motivation type, mais ceux-ci ne m'ont pas encore permis d'obtenir d'entretien. Pourriez-vous s'il vous plait, y jeter un oeil et me dire comment je peux l'améliorer avec vous ?\nMerci d'avance`,
        },
        {
          name: 'Je souhaite me préparer pour un entretien',
          message: `Bonjour ${participantsFirstNames},\nJe m'appelle ${currentUser.firstName}, je vais passer un entretien prochainement, mais j'aurais aimé le préparer avec un(e) coach en amont.\nSeriez-vous disponible ?\nMerci d'avance`,
        },
        {
          name: 'Solliciter le réseau',
          message: `Bonjour ${participantsFirstNames},\nJe m'appelle ${currentUser.firstName}, je vois que vous avez du réseau dans le secteur de [...]. Je suis aujourd'hui en manque de contact dans ce secteur.\nPourriez-vous solliciter votre réseau, pour m'aider dans la réalisation de mon projet professionnel ?\nMerci d'avance`,
        },
        {
          name: "Solliciter un retour d'expérience",
          message: `Bonjour ${participantsFirstNames},\nJe m'appelle ${currentUser.firstName}, je vois que vous avez de l'expérience dans le secteur [...] et serais ravi(e) d'échanger avec vous par rapport à mon projet professionnel.\nSeriez-vous disponible pour en parler ensemble ?\nMerci d'avance`,
        },
      ] as MessagingSuggestionItem[];
    } else if (isRoleIncluded(getRolesNotAdmin(), currentUser.role)) {
      // Suggestions for all other users (not admins)
      return [
        {
          name: 'Proposer un échange',
          message: `Bonjour ${participantsFirstNames},\nSi vous le souhaitez, nous pouvons échanger quelques minutes pour parler de votre projet et voir comment je peux vous donner un coup de pouce.\nÊtes-vous disponible dans les prochains jours ?`,
        },
        {
          name: 'Clarifier son projet',
          message: `Bonjour ${participantsFirstNames},\nPour commencer, pouvez-vous me préciser le type de poste que vous recherchez actuellement et dans quel secteur ?\nCela me permettra de mieux comprendre votre objectif et de voir comment je peux vous être utile.`,
        },
        {
          name: 'Activer mon réseau',
          message: `Bonjour ${participantsFirstNames},\nJe peux regarder comment activer mon réseau pour vous aider.\nAvez-vous un CV prêt à partager et des entreprises ou secteurs ciblés ?\nÀ partir de là, je pourrai regarder quelles pistes explorer.`,
        },
        {
          name: 'Partager mon expérience',
          message: `Bonjour ${participantsFirstNames},\nJe travaille dans le secteur […] et serais ravi(e) d'échanger avec vous sur votre projet.\nDites-moi ce que vous recherchez actuellement et je pourrai vous partager un retour d'expérience ou vous orienter vers des contacts utiles.`,
        },
      ] as MessagingSuggestionItem[];
    }

    return [];
  }, [currentUser, participants, variant]);

  if (suggestions.length === 0) {
    return null;
  }

  if (variant === 'coach-quick-replies') {
    if (newMessage.length > 0) {
      return null;
    }
    return (
      <MessagingQuickRepliesContainer>
        <MessagingQuickRepliesListContainer>
          <LucidIcon
            name="MessageCircleReply"
            size={18}
            color={COLORS.darkGray}
          />
          {suggestions.map((suggestion) => (
            <Item
              key={suggestion.name}
              suggestion={suggestion}
              onClick={() => {
                onSuggestionClick(suggestion);
              }}
            />
          ))}
        </MessagingQuickRepliesListContainer>
      </MessagingQuickRepliesContainer>
    );
  }

  return (
    <MessagingSuggestionsContainer>
      {newMessage.length <= 0 && (
        <>
          <MessagingSuggestionsExplanation>
            <SvgIcon name="IlluConversation" width={226} height={226} />
            <H3 title="Vous avez besoin d'aide pour vous lancer ?" center />
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
                  onSuggestionClick(suggestion);
                }}
              />
            ))}
          </MessagingSuggestionsListContainer>
        </>
      )}
    </MessagingSuggestionsContainer>
  );
};
