import React from 'react';
import { Reviews } from './Reviews';

const meta = {
  title: 'Reviews',
  component: Reviews,
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const reviews = [
  {
    image: '/static/img/temoignage-entreprise-stephane-danny.jpg',
    author: 'Stéphane',
    authorStatus: 'Recruteur de Danny',
    company: 'Les copains de Bastien',
    review: (
      <>
        &ldquo;Bien plus qu&apos;un candidat standard, on sent qu&apos;il y a un
        enjeu personnel et une dimension impactante&nbsp;!&ldquo;
      </>
    ),
  },
  {
    image: '/static/img/temoignage-entreprise-gregoire-mbemba.jpg',
    author: 'Grégoire',
    company: 'Dani Alu',
    authorStatus: "Recruteur de M'Bemba",
    review: (
      <>
        &ldquo;Le recrutement de M&apos;Bemba a ressoudé les équipes. Elles se
        sont investies dans un projet. Elles peuvent être très fières d’avoir
        fait en sorte que M&apos;Bemba soit épanoui et polyvalent dans
        l’atelier.&ldquo;
      </>
    ),
  },
];

const Template = () => {
  return (
    <Reviews
      title="Plus de 60 entreprises partenaires nous font confiance à LinkedOut"
      reviews={reviews}
    />
  );
};

export const PartialReviews = {
  render: Template,
};

export default meta;
