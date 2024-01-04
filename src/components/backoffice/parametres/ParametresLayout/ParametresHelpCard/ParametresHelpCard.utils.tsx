import React from 'react';
import CVIllu from 'assets/icons/illu-CV.svg';
import ConversationIllu from 'assets/icons/illu-conversation.svg';
import MaletteIllu from 'assets/icons/illu-malette.svg';
import TipsIllu from 'assets/icons/illu-poignee-de-main.svg';
import RSIllu from 'assets/icons/illu-reseaux-sociaux.svg';

export const PARAMETRES_HELP_CARD_TITLES = {
  card: {
    coach: 'Vos propositions de coup de pouce',
    candidat: "Vos demandes d'aide",
  },
  modal: {
    coach:
      'Sélectionnez les coups de pouce que vous souhaitez apporter aux candidats',
    candidat:
      'Sélectionnez les coups de pouce que vous souhaitez avoir auprès des coachs',
  },
} as const;

export const PARAMETRES_HELP_CARD_CONTENTS = {
  candidat: [
    {
      icon: <TipsIllu />,
      value: 'tips',
      title: 'Demander des conseils aux membre de la communauté',
      description:
        'Recevez des conseils personnalisés et un accompagnement de la part de nos coachs pour vous guider dans votre parcours professionnel.',
    },
    {
      icon: <MaletteIllu />,
      value: 'interview',
      title: 'Se préparer aux entretien d’embauche',
      description:
        "Profitez de l'expertise de nos coachs pour créer des CV et lettres de motivation qui mettent en avant vos atouts et compétences.",
    },
    {
      icon: <CVIllu />,
      value: 'cv',
      title: 'M’aider à réaliser mon CV et mes lettres de motivation',
      description:
        "Préparez-vous à réussir vos entretiens avec l'aide de nos coachs, qui vous apporteront des conseils pratiques et un soutien moral.",
    },
    {
      icon: <ConversationIllu />,
      value: 'event',
      title: 'Se rencontrer et échanger avec les membres de la communautés',
      description:
        "Rejoignez notre communauté lors d'événements pour partager vos expériences, apprendre des autres et tisser des liens professionnels précieux.",
    },
    {
      icon: <RSIllu />,
      value: 'network',
      title: 'Avoir plus de réseau professionnel',
      description:
        "Multipliez vos opportunités professionnelles en vous connectant avec des professionnels qui peuvent vous soutenir et vous ouvrir des portes sur le marché de l'emploi.",
    },
  ],
  coach: [
    {
      icon: <TipsIllu />,
      value: 'tips',
      title: 'Donner des conseils aux membres de la communauté',
      description:
        'Partagez votre savoir-faire et vos conseils pour aider les candidats à naviguer sur le marché du travail et à trouver des opportunités adaptées à leurs compétences.',
    },
    {
      icon: <MaletteIllu />,
      value: 'interview',
      title: 'Aider à préparer les entretiens d’embauche',
      description:
        "Mettez à profit votre expertise pour coacher les candidats, les aider à anticiper les questions d'entretiens et à communiquer efficacement leur motivation.",
    },
    {
      icon: <CVIllu />,
      value: 'cv',
      title: 'Aider à réaliser un CV et une lettre de motivation',
      description:
        'Utilisez votre expérience pour guider les candidats dans la création de documents professionnels qui reflètent leur potentiel et leurs expériences.',
    },
    {
      icon: <ConversationIllu />,
      value: 'event',
      title:
        'Se rencontrer lors d’événements avec les membres de la communautés',
      description:
        "Participer à des événements qui encouragent l'entraide, le partage d'expériences et le développement de réseaux professionnels enrichissants pour les candidats.",
    },
    {
      icon: <RSIllu />,
      value: 'network',
      title: 'Partager votre réseau professionnel',
      description:
        'Mettez en relation les candidats avec des contacts pertinents et intégez-les dans des réseaux qui peuvent favoriser leur insertion professionnelle.',
    },
  ],
} as const;
