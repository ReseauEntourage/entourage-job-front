import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { CompanyInviteCollaboratorsModal } from '@/src/features/modals/CompanyInviteCollaboratorsModal/CompanyInviteCollaboratorsModal';
import { openModal } from '@/src/features/modals/Modal';
import { CompanyRecruitementAlertModal } from '../CompanyRecruitementAlertCard/CompanyRecruitementAlertModal';
import { Context } from './DashboardNextSteps.types';

const iconSizeProps = { width: 80, height: 55 };

const stepEvents = {
  title: 'Participer à une rencontre',
  content: 'Rencontrez des coachs et candidats en ligne ou en physique',
  icon: <SvgIcon name="IlluDiscussionBanc" {...iconSizeProps} />,
  cta: {
    label: 'Voir les événements',
    href: '/backoffice/events',
  },
};

const stepPosture = {
  title: 'Avoir la bonne posture',
  icon: <SvgIcon name="IlluCoeurMainsOuvertesBleu" {...iconSizeProps} />,
  content: 'Lire le document sur la posture Entourage Pro',
  cta: {
    label: 'Lire la charte',
    href: '/conseils-posture',
  },
};

export const stepsByContext = {
  [Context.CANDIDATE]: [
    { ...stepEvents },
    {
      title: 'Découvrir le réseau d’entraide',
      icon: <SvgIcon name="IlluCoachEtCandidat" {...iconSizeProps} />,
      content: 'Retrouvez tous les coachs de la communauté',
      cta: {
        label: 'Contacter un coach',
        href: '/backoffice/annuaire?entity=user&role=Coach',
      },
    },
    stepPosture,
  ],
  [Context.COACH]: [
    { ...stepEvents },

    {
      title: 'Découvrir le réseau d’entraide',
      icon: <SvgIcon name="IlluCoachEtCandidat" {...iconSizeProps} />,
      content: 'Retrouvez tous les candidats de la communauté',
      cta: {
        label: 'Contacter un candidat',
        href: '/backoffice/annuaire?entity=user&role=Candidat',
      },
    },
    stepPosture,
  ],
  [Context.COMPANY_ADMIN_TBS_MODE]: [
    {
      title: 'Compléter ma page entreprise',
      icon: <SvgIcon name="IlluOrdiCV" {...iconSizeProps} />,
      content: 'Renseignez les informations de votre entreprise',
      cta: {
        label: 'Compléter',
        href: '/backoffice/companies/parametres',
      },
    },
    {
      title: 'Inviter mes collaborateurs',
      icon: <SvgIcon name="IlluCoachEtCandidat" {...iconSizeProps} />,
      content: 'Proposer à mes collaborateurs de devenir coach',
      cta: {
        label: 'Inviter',
        onClick: (currentUser) => {
          const companyId = currentUser?.company?.id || null;
          if (!companyId) {
            return;
          }
          openModal(<CompanyInviteCollaboratorsModal companyId={companyId} />);
        },
      },
    },
    {
      title: 'Découvrir le réseau d’entraide',
      icon: <SvgIcon name="IlluCoeurMainsOuvertesBleu" {...iconSizeProps} />,
      content: 'Retrouvez tous les candidats de la communauté',
      cta: {
        label: 'Contacter un candidat',
        href: '/backoffice/annuaire?entity=user&role=Candidat',
      },
    },
  ],
  [Context.COMPANY_ADMIN_RECRUITMENT_MODE]: [
    {
      title: 'Compléter ma page entreprise',
      icon: <SvgIcon name="IlluOrdiCV" {...iconSizeProps} />,
      content: 'Renseignez les informations de votre entreprise',
      cta: {
        label: 'Compléter',
        href: '/backoffice/companies/parametres',
      },
    },
    {
      title: 'Créer une alerte',
      icon: <SvgIcon name="IlluCoachEtCandidat" {...iconSizeProps} />,
      content: 'Trouvez les candidats qui vous correspondent',
      cta: {
        label: 'Créer une alerte',
        onClick: () => {
          openModal(<CompanyRecruitementAlertModal />);
        },
      },
    },
    {
      title: 'Découvrir le réseau d’entraide',
      icon: <SvgIcon name="IlluCoeurMainsOuvertesBleu" {...iconSizeProps} />,
      content: 'Retrouvez tous les candidats de la communauté',
      cta: {
        label: 'Contacter un candidat',
        href: '/backoffice/annuaire?entity=user&role=Candidat',
      },
    },
  ],
};
