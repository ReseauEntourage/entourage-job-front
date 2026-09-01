import React, { useState } from 'react';
import { Button, Card, LucidIcon, Text } from '@/src/components/ui';
import { Badge, BadgeVariant } from '@/src/components/ui/Badge/Badge';
import { RoundBadge } from '@/src/components/ui/Badge/RoundBadge/RoundBadge';
import { TextArea } from '@/src/components/ui/Inputs/TextArea/TextArea';
import { UserRoles } from '@/src/constants/users';
import { useSendCheckinNoteMutation } from '@/src/use-cases/checkin';
import {
  StyledCheckinFinalScreenHigh,
  StyledCheckinFinalScreenHighActions,
  StyledCheckinFinalScreenHighBadges,
  StyledCheckinFinalScreenHighContent,
} from './CheckinFinalScreenHigh.styles';

const NOTE_BADGES_COPY: Record<
  UserRoles,
  {
    thanksLabel: string;
    thanksContent: (otherFirstName: string) => string;
    benefitContent: (otherFirstName: string) => string;
  }
> = {
  [UserRoles.COACH]: {
    thanksLabel: 'Merci pour votre confiance',
    thanksContent: (otherFirstName) =>
      `Merci pour votre confiance et votre motivation, ${otherFirstName} !`,
    benefitContent: (otherFirstName) =>
      `Nos échanges m'apportent beaucoup, merci pour votre implication constante, ${otherFirstName} !`,
  },
  [UserRoles.CANDIDATE]: {
    thanksLabel: 'Merci pour votre soutien',
    thanksContent: (otherFirstName) =>
      `Merci pour votre soutien, ${otherFirstName}, ça compte beaucoup pour moi !`,
    benefitContent: (otherFirstName) =>
      `Nos échanges m'aident vraiment à avancer, merci ${otherFirstName} !`,
  },
  [UserRoles.ADMIN]: {
    thanksLabel: 'Merci pour votre soutien',
    thanksContent: (otherFirstName) =>
      `Merci pour votre soutien, ${otherFirstName}, ça compte beaucoup pour moi !`,
    benefitContent: (otherFirstName) =>
      `Nos échanges m'aident vraiment à avancer, merci ${otherFirstName} !`,
  },
  [UserRoles.REFERER]: {
    thanksLabel: 'Merci pour votre soutien',
    thanksContent: (otherFirstName) =>
      `Merci pour votre soutien, ${otherFirstName}, ça compte beaucoup pour moi !`,
    benefitContent: (otherFirstName) =>
      `Nos échanges m'aident vraiment à avancer, merci ${otherFirstName} !`,
  },
};

const getNoteBadges = (
  role: UserRoles,
  otherFirstName: string
): { id: string; label: string; content: string }[] => {
  const copy = NOTE_BADGES_COPY[role];
  return [
    {
      id: 'thanks',
      label: copy.thanksLabel,
      content: copy.thanksContent(otherFirstName),
    },
    {
      id: 'benefit',
      label: "Ce que ça m'a apporté",
      content: copy.benefitContent(otherFirstName),
    },
    {
      id: 'reconnect',
      label: "J'aimerais reprendre contact",
      content: `J'aimerais qu'on reprenne contact, ${otherFirstName}, ça me ferait plaisir d'avoir de vos nouvelles !`,
    },
  ];
};

interface CheckinFinalScreenHighProps {
  conversationId: string;
  currentUserRole: UserRoles;
  otherFirstName: string;
}

export const CheckinFinalScreenHigh = ({
  conversationId,
  currentUserRole,
  otherFirstName,
}: CheckinFinalScreenHighProps) => {
  const noteBadges = getNoteBadges(currentUserRole, otherFirstName);
  const [step, setStep] = useState<'compose' | 'done'>('compose');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sendNote, { isLoading }] = useSendCheckinNoteMutation();

  const redirectToConversation = () => {
    window.location.href = `/backoffice/messaging?conversationId=${conversationId}`;
  };

  const redirectToNetwork = () => {
    window.location.href = '/backoffice/annuaire';
  };

  if (step === 'done') {
    return (
      <StyledCheckinFinalScreenHigh>
        <RoundBadge bgColor="yellowSport" size={64} borderSize={0}>
          <LucidIcon name="Star" color="white" size={24} />
        </RoundBadge>
        <Text size="xxlarge" weight="semibold">
          Votre mot est parti à {otherFirstName} !
        </Text>
        <Text>
          Il a été envoyé dans votre conversation avec {otherFirstName}.
        </Text>
        <Text>Le reste de vos réponses ne sort pas de l'équipe Entourage.</Text>
        <Button size="large" onClick={redirectToConversation}>
          Retourner à la conversation
        </Button>
        <Button variant="text" onClick={redirectToNetwork}>
          Voir d'autres profils
        </Button>
      </StyledCheckinFinalScreenHigh>
    );
  }

  return (
    <StyledCheckinFinalScreenHigh>
      <RoundBadge bgColor="yellowSport" size={64} borderSize={0}>
        <LucidIcon name="Star" color="white" size={24} />
      </RoundBadge>
      <Text size="xxlarge" weight="semibold">
        Merci, faites-le savoir à {otherFirstName} !
      </Text>
      <Card>
        <Text>
          {otherFirstName} ne saura rien de ce que vous avez répondu. Mais votre
          mot, lui, lui arrivera dans votre conversation.
        </Text>
        <br />
        <StyledCheckinFinalScreenHighContent>
          <StyledCheckinFinalScreenHighBadges>
            {noteBadges.map((badge) => (
              <Badge
                key={badge.id}
                variant={
                  selectedBadgeId === badge.id
                    ? BadgeVariant.Primary
                    : BadgeVariant.HoverBlue
                }
                onClick={() => {
                  setSelectedBadgeId(badge.id);
                  setContent(badge.content);
                }}
              >
                {badge.label}
              </Badge>
            ))}
          </StyledCheckinFinalScreenHighBadges>
          <TextArea
            id="checkin-note-content"
            name="checkin-note-content"
            title="Votre mot"
            showLabel
            value={content}
            onChange={setContent}
            maxLength={2000}
            rows={4}
          />
        </StyledCheckinFinalScreenHighContent>
      </Card>
      {error && <Text color="lightRed">{error}</Text>}
      <StyledCheckinFinalScreenHighActions>
        <Button
          size="large"
          disabled={isLoading || !content.trim()}
          onClick={async () => {
            setError(null);
            try {
              await sendNote({ conversationId, content }).unwrap();
              setStep('done');
            } catch {
              setError('Une erreur est survenue, veuillez réessayer.');
            }
          }}
        >
          Envoyer le mot
        </Button>
        <Button variant="text" onClick={() => setStep('done')}>
          Passer
        </Button>
      </StyledCheckinFinalScreenHighActions>
    </StyledCheckinFinalScreenHigh>
  );
};
