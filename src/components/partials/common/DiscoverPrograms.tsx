import React, { Ref } from 'react';
import {
  IlluBulleQuestionCheck,
  IlluCalendrier,
  IlluTeteHomme,
  OrienterCarteSolidaire,
  OrienterSablier,
} from 'assets/icons/icons';
import { SimpleCardsImageCTA } from 'src/components/partials/utils/SimpleCardsImageCTA';
import { Text } from 'src/components/utils/Text';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';

export const DiscoverPrograms = ({
  handleClick,
  refCoupDePouce,
  refProgramme360,
  role,
}: {
  handleClick: (ref: Ref<HTMLDivElement>) => void;
  refCoupDePouce: Ref<HTMLDivElement>;
  refProgramme360: Ref<HTMLDivElement>;
  role: 'Coach' | 'Candidat';
}) => {
  const dataByRole = {
    Candidat: {
      title: 'Découvrez nos formats pour booster votre recherche d’emploi',
      subtitle: (
        <>
          Clarifier votre projet professionnel, élaborer un CV et une lettre de
          motivation, vous préparer aux entretiens, vous soutenir dans vos
          recherches et vous aider à constituer votre réseau : grâce à nos
          coachs, vous serez prêt(e)s à intégrer le monde professionnel.
          <br />
          Dans tous les cas, nos équipes vous accompagnent et vous orientent
          vers les coachs qui pourront le mieux vous aider !
        </>
      ),
      cards: [
        {
          title: 'Format Coup de pouce',
          description:
            "Je souhaite bénéficier de coups de pouce ponctuels de la communauté pour m'aider dans ma recherche d'emploi, que cela concerne la rédaction de mon CV, une relecture de ma lettre de motivation, ou une mise en relation.",
          img: '/static/img/travailler-programme-cdp.png',
          criterias: [
            {
              illu: <IlluCalendrier width={30} height={30} />,
              text: 'Ponctuel',
            },
            {
              illu: <OrienterSablier width={30} height={30} />,
              text: 'Selon vos besoins',
            },
            {
              illu: <IlluBulleQuestionCheck width={30} height={30} />,
              text: 'En physique ou en visio',
            },
            {
              illu: <OrienterCarteSolidaire width={30} height={30} />,
              text: 'Partout en France',
            },
          ],
          onClick: () => {
            handleClick(refCoupDePouce);
            gaEvent(GA_TAGS.PAGE_AIDER_DECOUVRIR_PROGRAMME_COUP_DE_POUCE_CLICK);
          },
          CTAText: "M'inscrire",
        },
        {
          title: 'Format 360',
          description:
            'Engagez-vous avec un(e) candidat(e) dans un accompagnement  sur 6 mois, de la définition de son projet jusqu’à sa prise de poste !',
          img: '/static/img/travailler-programme-360.png',

          criterias: [
            {
              illu: <IlluTeteHomme width={30} height={30} />,
              text: 'Pour les jeunes de moins de 26 ans',
            },
            {
              illu: <IlluCalendrier width={30} height={30} />,
              text: 'De 3 à 6 mois',
            },
            {
              illu: <OrienterSablier width={30} height={30} />,
              text: '1 heure par semaine',
            },
            {
              illu: <IlluBulleQuestionCheck width={30} height={30} />,
              text: 'En physique ou en visio',
            },
            {
              illu: <OrienterCarteSolidaire width={30} height={30} />,
              text: 'Disponible à Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93), Lille, Lyon, Rennes',
            },
          ],
          onClick: () => {
            handleClick(refProgramme360);
            gaEvent(GA_TAGS.PAGE_AIDER_DECOUVRIR_PROGRAMME_360_CLICK);
          },
          CTAText: "M'inscrire",
        },
      ],
    },
    Coach: {
      title: '2 formats pour vous engager et soutenir nos candidat(e)s ',
      subtitle: (
        <>
          <Text size="large" center>
            Relayer une recherche d’emploi sur LinkedIn, aider à la rédaction
            d’un CV ou d’une lettre de motivation, préparer un entretien,
            partager un conseil ou un contact : grâce à vous, nos candidat(e)s
            auront toutes les cartes en main pour appréhender le monde
            professionnel et y trouver leur place.
          </Text>
          <br />
          <Text size="large" center variant="italic">
            Quel que soit le format que vous choisissez, nos équipes vous
            orientent vers les candidats que vous pourrez le mieux accompagner !
          </Text>
        </>
      ),
      cards: [
        {
          title: 'Format Coup de pouce',
          description:
            'Donnez des coups de pouce variés et ponctuels à nos candidat(e)s : améliorer un CV, préparer un entretien d’embauche, être mis en relation, etc.',
          img: '/static/img/travailler-programme-cdp.png',
          criterias: [
            {
              illu: <IlluCalendrier width={30} height={30} />,
              text: 'Ponctuel',
            },
            {
              illu: <OrienterSablier width={30} height={30} />,
              text: 'Selon vos besoins',
            },
            {
              illu: <IlluBulleQuestionCheck width={30} height={30} />,
              text: 'En physique ou en visio',
            },
            {
              illu: <OrienterCarteSolidaire width={30} height={30} />,
              text: 'Partout en France',
            },
          ],
          onClick: () => {
            handleClick(refCoupDePouce);
            gaEvent(GA_TAGS.PAGE_AIDER_DECOUVRIR_PROGRAMME_COUP_DE_POUCE_CLICK);
          },
          CTAText: "M'inscrire",
        },
        {
          title: 'Format 360',
          description:
            'Engagez-vous avec un(e) candidat(e) dans un accompagnement sur 6 mois, de la définition de son projet jusqu’à sa prise de poste !',
          img: '/static/img/travailler-programme-360.png',

          criterias: [
            {
              illu: <IlluCalendrier width={30} height={30} />,
              text: 'De 3 à 6 mois',
            },
            {
              illu: <OrienterSablier width={30} height={30} />,
              text: '1 heure par semaine',
            },
            {
              illu: <IlluBulleQuestionCheck width={30} height={30} />,
              text: 'En physique ou en visio',
            },
            {
              illu: <OrienterCarteSolidaire width={30} height={30} />,
              text: 'Disponible à Paris (75), Hauts-de-Seine (92), Seine-Saint-Denis (93), Lille, Lyon, Rennes',
            },
          ],
          onClick: () => {
            handleClick(refProgramme360);
            gaEvent(GA_TAGS.PAGE_AIDER_DECOUVRIR_PROGRAMME_360_CLICK);
          },
          CTAText: "M'inscrire",
        },
      ],
    },
  };

  return (
    <SimpleCardsImageCTA
      title={dataByRole[role].title}
      subtitle={dataByRole[role].subtitle}
      cards={dataByRole[role].cards}
    />
  );
};
