import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  StyledDocumentCenteredText,
  StyledDocumentTitleText,
} from '../Documents.styles';
import { Section } from 'src/components/utils';
import { H1, H4 } from 'src/components/utils/Headings';
import { COLORS } from 'src/constants/styles';

const textContent = [
  {
    title: 'Entraide',
    description:
      'Le réseau Entourage Pro permet de créer de nouvelles rencontres et de favoriser des opportunités professionnels pour les plus exclus. Les aides financières (bon cadeau, cagnotte, virement, paypal…) ne sont pas autorisées.',
  },
  {
    title: 'Rencontrer et partager dans la bienveillance',
    description:
      'Je considère mon interlocuteur par le prisme de ses qualités et de ses forces, je me considère donc comme égal à mon interlocuteur. Aucune forme de déconsidération de l’autre n’est autorisée. J’échange avec mon interlocuteur de manière courtoise et respectueuse et suis honnête et transparent avec lui. ',
  },
  {
    title: 'Partage de réseaux et de conseils',
    description:
      'Je peux demander ou proposer des conseils professionnels (CV, simulation d’entretien…), du soutien (encouragement, confiance en soi…), des mises en relations avec mon réseau (professionnel et personnel) et des temps de partage (café, rencontres...). Si je m’engage avec mon interlocuteur dans une relation d’entraide, je m’engage à lui répondre dans les meilleurs délais.',
  },
  {
    title: 'Consentement',
    description:
      'Lorsque je publie une demande, pose une question pour une tierce personne, je m’assure d’obtenir son accord au préalable. ',
  },
  {
    title: 'Non discrimination',
    description:
      'Entourage Pro ne tolère pas les attitudes intolérantes, sexistes et discriminantes.',
  },
  {
    title: 'Protection des personnes',
    description:
      'Je garantie que mes actions ne contiennent aucune donnée personnelle (nom de famille, téléphone, adresse précise…), permettant d’identifier et de localiser précisément une personne, ni aucune donnée sensible (médicale, judiciaire…).',
  },
  {
    title: 'Profiter de la rencontre !',
    description:
      'Je fais en sorte que mes actions soient synonymes de rencontres, de partage, de chaleur humaine, le tout dans la bonne humeur !',
  },
];

export const CharteEthique = () => {
  return (
    <Section style="custom-primary">
      <H1 title="Charte Ethique" color={COLORS.primaryOrange} center />
      <StyledDocumentCenteredText>
        Entourage Pro est un réseau professionnel solidaire qui permet le retour
        à l&lsquo;emploi des plus exclus en favorisant la rencontre entre toutes
        et tous et en multipliant les opportunités professionnels. Pour la
        sécurité du réseau et de ses membres, nous vous demandons de vous
        engager à respecter les principes ci-dessous. Toutes actions ne
        respectant pas cette charte peuvent conduire à une exclusion ponctuelle
        ou définitive du réseau. Si vous constatez une entorse à ces principes,
        contactez le référent Entourage Pro.
      </StyledDocumentCenteredText>
      {textContent.map((item) => {
        const key = uuid();
        return (
          <StyledDocumentTitleText key={key}>
            <H4
              title={item.title}
              color={COLORS.primaryOrange}
              weight="normal"
            />
            <p>{item.description}</p>
          </StyledDocumentTitleText>
        );
      })}
    </Section>
  );
};
