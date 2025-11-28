import React, { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { UserRoles } from '@/src/constants/users';
import {
  StyledDashboardArticle,
  StyledDashboardArticleImage,
  StyledDashboardArticleText,
  StyledDashboardCardContentContainer,
  StyledDashboardArticlesContainer,
} from '../Dashboard.styles';
import { Button, Card, LegacyImg } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

enum Context {
  COACH = 'COACH',
  CANDIDATE = 'CANDIDATE',
  REFERER = 'REFERER',
  COMPANY = 'COMPANY',
}

const coachArticles = [
  {
    title: 'Tout savoir sur la plateforme Entourage Pro',
    link: '/La-plateforme-Entourage-Pro-780a7bdfd3344a39870761144d0c236b',
    image: '/static/img/dashboard-bao-coach-1.jpg',
  },
  {
    title: '10 coups de pouce à réaliser en tant que coach',
    link: '/Point-de-d-part-du-coach-Coup-de-pouce-fe4d3ba8516e454b889184c3732604f0',
    image: '/static/img/dashboard-bao-coach-2.jpg',
  },
  {
    title: 'Le réseau, un outil essentiel pour lutter contre l’exclusion',
    link: '/Point-de-d-part-du-coach-Coup-de-pouce-fe4d3ba8516e454b889184c3732604f0',
    image: '/static/img/dashboard-bao-coach-3.jpg',
  },
];

const candidateArticles = [
  {
    title: 'Tout savoir sur la plateforme Entourage Pro',
    link: '/Prise-en-main-de-la-plateforme-361d64fe142d44ed9c74eb72607d6a4b',
    image: '/static/img/dashboard-bao-candidat-1.jpg',
  },
  {
    title: 'Bien réaliser son CV Entourage Pro',
    link: '/L-laboration-du-CV-Entourage-Pro-e814207d6a784337874df207a6bd0a49',
    image: '/static/img/dashboard-bao-candidat-2.jpg',
  },
  {
    title: 'Comment contacter un coach ?',
    link: '/Comment-contacter-un-coach-sur-la-plateforme-0b7f66b5991c487d8a7aefe55139d806',
    image: '/static/img/dashboard-bao-candidat-3.jpg',
  },
];
const companyArticles = [
  {
    title: 'Préparer l’intégration d’un candidat',
    link: '/Pr-parer-et-r-ussir-l-int-gration-d-un-collaborateur-issu-d-un-parcours-atypique-2792fdfbf16c80878fcafc6c825ef678',
    image: '/static/img/dashboard-bao-company-1.jpg',
  },
  {
    title: 'Guide pratique du coach',
    link: '/Le-r-le-du-coach-guide-pratique-pour-les-collaborateurs-2792fdfbf16c80b3a015f5d8f8cb6066',
    image: '/static/img/dashboard-bao-company-2.jpg',
  },
  {
    title: 'Mobiliser mes collaborateurs',
    link: '/Comment-mobiliser-les-collaborateurs-autour-d-un-projet-d-inclusion-27d2fdfbf16c807d9c00f33743d65977',
    image: '/static/img/dashboard-bao-company-3.jpg',
  },
];

export const DashboardToolboxCard = () => {
  const user = useAuthenticatedUser();
  const isCompanyAdmin = user.company && user.company.companyUser?.isAdmin;

  const context = useMemo(() => {
    if (user.role === UserRoles.COACH && isCompanyAdmin) {
      return Context.COMPANY;
    }
    if (user.role === UserRoles.CANDIDATE) {
      return Context.CANDIDATE;
    }
    if (user.role === UserRoles.REFERER) {
      return Context.REFERER;
    }
    return Context.COACH;
  }, [isCompanyAdmin, user.role]);

  const toolboxContents: {
    [K in Context]?: {
      subtitle: string;
      url: string;
      articles: {
        title: string;
        link: string;
        image: string;
      }[];
    };
  } = useMemo(() => {
    return {
      [Context.CANDIDATE]: {
        subtitle:
          'Découvrez les contenus pédagogiques pour booster vos opportunités professionnelles',
        url: process.env.NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL as string,
        articles: candidateArticles,
      },
      [Context.COACH]: {
        subtitle:
          'Découvrez les contenus pédagogiques pour vous orienter dans votre rôle de coach',
        url: (isCompanyAdmin
          ? process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL
          : process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL) as string,
        articles: coachArticles,
      },
      [Context.REFERER]: {
        subtitle:
          'Découvrez les contenus pédagogiques pour accompagner les candidats dans leur recherche d’emploi',
        url: process.env.NEXT_PUBLIC_TOOLBOX_COACH_URL as string,
        articles: coachArticles,
      },
      [Context.COMPANY]: {
        subtitle:
          'Découvrez les ressources et outils pratiques pour déployer et animer votre démarche d’inclusion.',
        url: process.env.NEXT_PUBLIC_TOOLBOX_COMPANY_URL as string,
        articles: companyArticles,
      },
    };
  }, [isCompanyAdmin]);

  const toolbox = toolboxContents[context];
  if (!toolbox) {
    return null;
  }
  return (
    <Card title="Guides et conseils" subtitle={toolbox.subtitle} centerTitle>
      <StyledDashboardCardContentContainer>
        <StyledDashboardArticlesContainer>
          {toolbox.articles.map((article) => {
            const uuidValue = uuid();
            return (
              <a
                key={uuidValue}
                href={process.env.NEXT_PUBLIC_TOOLBOX_URL + article.link}
                target="_blank"
                rel="noreferrer"
              >
                <StyledDashboardArticle>
                  <StyledDashboardArticleImage>
                    <LegacyImg src={article.image} alt={article.title} cover />
                  </StyledDashboardArticleImage>
                  <StyledDashboardArticleText>
                    <H6 title={article.title} center />
                  </StyledDashboardArticleText>
                </StyledDashboardArticle>
              </a>
            );
          })}
        </StyledDashboardArticlesContainer>
        <Button variant="primary" rounded isExternal href={toolbox.url} newTab>
          Voir tous les conseils
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
