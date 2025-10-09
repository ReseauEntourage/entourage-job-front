import React from 'react';
import { CompanyInviteCollaboratorsModal } from '@/src/components/modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal';
import { openModal } from '@/src/components/modals/Modal';
import {
  IlluBulleQuestion,
  IlluCoachEtCandidat,
  IlluCoeurMainsOuvertesBleu,
  IlluCV,
  IlluOrdiCV,
} from 'assets/icons/icons';
import { CompanyRecruitementAlertModal } from '../CompanyRecruitementAlertCard/CompanyRecruitementAlertModal';
import { Context } from './DashboardNextSteps.types';

const iconSizeProps = { width: 80, height: 55 };

const webinarStep = {
  title: "S'inscrire au webinaire",
  icon: <IlluBulleQuestion {...iconSizeProps} />,
  content: 'Besoin d’en savoir plus sur la plateforme Entourage Pro ?',
  cta: {
    label: "S'inscrire",
    href: process.env.NEXT_PUBLIC_WEBINAR_URL,
  },
};

export const stepsByContext = {
  [Context.CANDIDATE]: [
    {
      ...webinarStep,
    },
    {
      title: 'Ajouter mon CV',
      icon: <IlluCV {...iconSizeProps} />,
      content: 'Rendre visible et valoriser votre projet professionnel',
      cta: {
        label: 'Ajouter mon CV',
        href: `/backoffice/parametres`,
      },
    },
    {
      title: 'Découvrir le réseau d’entraide',
      icon: <IlluCoachEtCandidat {...iconSizeProps} />,
      content: 'Retrouvez tous les coachs de la communauté',
      cta: {
        label: 'Contacter un coach',
        href: '/backoffice/annuaire?role=Coach',
      },
    },
  ],
  [Context.COACH]: [
    {
      ...webinarStep,
    },
    {
      title: 'Découvrir le réseau d’entraide',
      icon: <IlluCoachEtCandidat {...iconSizeProps} />,
      content: 'Retrouvez tous les candidats de la communauté',
      cta: {
        label: 'Contacter un candidat',
        href: '/backoffice/annuaire?role=Candidat',
      },
    },
    {
      title: 'Avoir la bonne posture',
      icon: <IlluCoeurMainsOuvertesBleu {...iconSizeProps} />,
      content: 'Lire le document sur la posture Entourage Pro',
      cta: {
        label: 'Lire',
        href: '/conseils-posture',
      },
    },
  ],
  [Context.COMPANY_ADMIN_TBS_MODE]: [
    {
      title: 'Compléter ma page entreprise',
      icon: <IlluOrdiCV {...iconSizeProps} />,
      content: 'Renseignez les informations de votre entreprise',
      cta: {
        label: 'Compléter',
        href: '/backoffice/companies/parametres',
      },
    },
    // {
    //   title: 'Les team building solidaires',
    //   icon: <IlluCoeurMainsOuvertesBleu {...iconSizeProps} />,
    //   content: "Découvrir les formats d'engagement",
    //   cta: {
    //     label: 'Découvrir',
    //     href: '/backoffice/engager-mon-entreprise',
    //   },
    // },
    {
      title: 'Inviter mes collaborateurs',
      icon: <IlluCoachEtCandidat {...iconSizeProps} />,
      content: 'Proposer à mes collaborateurs de devenir coach',
      cta: {
        label: 'Inviter',
        onClick: (currentUser) => {
          const companyId = currentUser?.company?.id || null;
          if (!companyId) return;
          openModal(<CompanyInviteCollaboratorsModal companyId={companyId} />);
        },
      },
    },
    // While waiting for TBS feature to be finished, we replace this step with the network discovery step
    {
      title: 'Découvrir le réseau d’entraide',
      icon: <IlluCoeurMainsOuvertesBleu {...iconSizeProps} />,
      content: 'Retrouvez tous les candidats de la communauté',
      cta: {
        label: 'Contacter un candidat',
        href: '/backoffice/annuaire?role=Candidat',
      },
    },
  ],
  [Context.COMPANY_ADMIN_RECRUITMENT_MODE]: [
    {
      title: 'Compléter ma page entreprise',
      icon: <IlluOrdiCV {...iconSizeProps} />,
      content: 'Renseignez les informations de votre entreprise',
      cta: {
        label: 'Compléter',
        href: '/backoffice/companies/parametres',
      },
    },
    {
      title: 'Créer une alerte',
      icon: <IlluCoachEtCandidat {...iconSizeProps} />,
      content: 'Trouvez les candidats qui vous correspondent',
      cta: {
        label: 'Créer une alerte',
        onClick: () => {
          openModal(<CompanyRecruitementAlertModal />);
        },
      },
    },
    // {
    //   title: 'Les team building solidaires',
    //   icon: <IlluCoeurMainsOuvertesBleu {...iconSizeProps} />,
    //   content: "Découvrir les formats d'engagement",
    //   cta: {
    //     label: 'Découvrir',
    //     href: '/backoffice/engager-mon-entreprise',
    //   },
    // },
    // While waiting for TBS feature to be finished, we replace this step with the network discovery step
    {
      title: 'Découvrir le réseau d’entraide',
      icon: <IlluCoeurMainsOuvertesBleu {...iconSizeProps} />,
      content: 'Retrouvez tous les candidats de la communauté',
      cta: {
        label: 'Contacter un candidat',
        href: '/backoffice/annuaire?role=Candidat',
      },
    },
  ],
};
