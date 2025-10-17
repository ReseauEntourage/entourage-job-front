import React from 'react';
import { IlluCoachEtCandidat } from '@/assets/icons/icons';
import { LegacyImg, Section } from '@/src/components/utils';
import { H3 } from '@/src/components/utils/Headings';
import { EntreprisesActionsItem } from './EntreprisesActionItem/EntreprisesActionItem';
import {
  StyledContentContainer,
  StyledEntreprisesActionsContainer,
} from './EntreprisesActions.styles';

const actions = [
  {
    illu: <IlluCoachEtCandidat width={200} height={140} />,
    title: 'Engagez vos collaborateurs à devenir coachs bénévoles',
    description:
      'Relecture de CV, préparation aux entretiens... En quelques clics, vos collaborateurs  peuvent devenir coachs bénévoles et donnner des coups de pouce à nos candidat.e.s.',
    cta: {
      href: '/entreprises/coach-benevole',
      label: "S'inscrire",
    },
  },
  {
    illu: (
      <LegacyImg
        src="/static/img/illustrations/atelier-cuisine.png"
        alt="Proposez un Team Building solidaire à vos équipes"
        width={300}
        height={140}
      />
    ),
    title: 'Proposez un Team Building solidaire à vos équipes',
    description:
      'Découvrez nos différents formats pour souder vos équipes et les engager  dans des actions RSE concrètes.Un moment fort pour vos collaborateurs, un impact réel sur la société ! ',
    cta: {
      href: process.env.NEXT_PUBLIC_ENTOURAGE_PRO_TEAM_BUILDING as string,
      label: 'En savoir plus',
    },
  },
];

export const EntreprisesActions = () => {
  return (
    <Section>
      <StyledEntreprisesActionsContainer>
        <H3 center title="Passez à l’action avec Entourage Pro " />
        <StyledContentContainer>
          {actions.map((action) => (
            <EntreprisesActionsItem key={action.title} action={action} />
          ))}
        </StyledContentContainer>
      </StyledEntreprisesActionsContainer>
    </Section>
  );
};
