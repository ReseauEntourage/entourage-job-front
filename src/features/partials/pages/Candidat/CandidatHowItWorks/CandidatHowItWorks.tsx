import React from 'react';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import {
  ConnectedStep,
  ConnectedStepsGrid,
} from '@/src/features/partials/utils/ConnectedStepsGrid';

const STEPS: ConnectedStep[] = [
  {
    title: 'Vous complétez votre profil',
    description: 'Votre parcours et ce que vous recherchez',
    illu: <SvgIcon name="IlluBulleQuestion" width={64} height={64} />,
  },
  {
    title: 'Vous êtes mis en relation avec des coachs adaptés à votre profil',
    description:
      "Vous les contactez et pouvez en contacter d'autres dans tout le réseau mis à votre disposition",
    illu: <SvgIcon name="IlluBulleQuestion" width={64} height={64} />,
  },
  {
    title: 'Vous profitez de leurs coups de pouce',
    description:
      "Clarifier votre projet, relire votre CV, vos lettres de motivations, faire des simulations d'entretiens, etc.",
    illu: <SvgIcon name="IlluBulleQuestion" width={64} height={64} />,
  },
  {
    title: 'Vous avancez à votre rythme',
    description:
      "C'est vous qui menez votre recherche, les coachs sont là pour vous soutenir.",
    illu: <SvgIcon name="IlluBulleQuestion" width={64} height={64} />,
  },
];

export const CandidatHowItWorks = () => {
  return <ConnectedStepsGrid title="Comment ça marche ?" steps={STEPS} />;
};
