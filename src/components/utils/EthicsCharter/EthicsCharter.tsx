import React from 'react';
import { Text, TextProps } from '../Text';
import {
  EthicsCharterContainer,
  EthicsCharterItem,
} from './EthicsCharter.styles';

export const EthicsCharter = () => {
  const titleProps = {
    weight: 'normal',
    size: 'xxlarge',
    color: 'primaryBlue',
  } as TextProps;

  const items = [
    {
      title: 'Entraide',
      content:
        'Le réseau Entourage Pro permet de créer de nouvelles rencontres et de favoriser des opportunités professionnelles pour les plus exclus. Les aides financières (bon cadeau, cagnotte, virement, paypal…) ne sont pas autorisées.',
    },
    {
      title: 'Rencontrer et partager dans la bienveillance',
      content:
        'Je considère mon interlocuteur par le prisme de ses qualités et de ses forces, je me considère donc comme égal à mon interlocuteur. Aucune forme de déconsidération de l’autre n’est autorisée. J’échange avec mon interlocuteur de manière courtoise et respectueuse et suis honnête et transparent avec lui.',
    },
    {
      title: 'Partage de réseaux et de conseils',
      content:
        'Je peux demander ou proposer des conseils professionnels (CV, simulation d’entretien…), du soutien (encouragement, confiance en soi…), des mises en relations avec mon réseau (professionnel et personnel) et des temps de partage (café, rencontres...). Si je m’engage avec mon interlocuteur dans une relation d’entraide, je m’engage à lui répondre dans les meilleurs délais.',
    },
    {
      title: 'Non discrimination',
      content:
        'Entourage Pro ne tolère pas les attitudes intolérantes, sexistes et discriminantes.',
    },
    {
      title: 'Protection des personnes',
      content:
        'Je garantie que mes actions ne contiennent aucune donnée personnelle (nom de famille, téléphone, adresse précise…), permettant d’identifier et de localiser précisément une personne, ni aucune donnée sensible (médicale, judiciaire…).',
    },
    {
      title: 'Profiter de la rencontre !',
      content:
        'Je fais en sorte que mes actions soient synonymes de rencontres, de partage, de chaleur humaine, le tout dans la bonne humeur !',
    },
  ];

  return (
    <EthicsCharterContainer>
      {items.map((item, idx) => (
        <EthicsCharterItem key={idx}>
          <Text {...titleProps}>{item.title}</Text>
          <Text>{item.content}</Text>
        </EthicsCharterItem>
      ))}
    </EthicsCharterContainer>
  );
};
