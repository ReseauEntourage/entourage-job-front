import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  StyledDashboardArticle,
  StyledDashboardArticleImage,
  StyledDashboardArticleText,
  StyledDashboardCardContent,
  StyledDashboardCardContentContainer,
  StyledDashboardArticlesContainer,
} from '../Dashboard.styles';
import { Button, Card, Img } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text';
import { NormalUserRole, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

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
    title: 'Bien réaliser son CV Entourage pro',
    link: '/L-laboration-du-CV-Entourage-Pro-e814207d6a784337874df207a6bd0a49',
    image: '/static/img/dashboard-bao-candidat-2.jpg',
  },
  {
    title: 'Comment contacter un coach ?',
    link: '/Comment-contacter-un-coach-sur-la-plateforme-0b7f66b5991c487d8a7aefe55139d806',
    image: '/static/img/dashboard-bao-candidat-3.jpg', // Todo: change photo ?
  },
];

const toolboxContents: {
  [K in NormalUserRole]: {
    subtitle: string;
    url: string;
    articles: {
      title: string;
      link: string;
      image: string;
    }[];
  };
} = {
  [USER_ROLES.CANDIDATE]: {
    subtitle:
      'Découvrez les contenus pédagogiques pour booster vos opportunités professionnelles',
    url: process.env.TOOLBOX_CANDIDATE_URL as string,
    articles: candidateArticles,
  },
  [USER_ROLES.COACH]: {
    subtitle:
      'Découvrez les contenus pédagogiques pour vous orienter dans votre rôle de coach',
    url: process.env.TOOLBOX_COACH_URL as string,
    articles: coachArticles,
  },
};

export const DashboardToolboxCard = () => {
  const user = useAuthenticatedUser();

  return (
    <Card
      title="Guides et conseils"
      subtitle={toolboxContents[user.role].subtitle}
      centerTitle
    >
      <StyledDashboardCardContentContainer>
        <StyledDashboardCardContent>
          <StyledDashboardArticlesContainer>
            {toolboxContents[user.role].articles.map((article) => {
              const uuidValue = uuid();
              return (
                <a
                  key={uuidValue}
                  href={process.env.TOOLBOX_URL + article.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <StyledDashboardArticle>
                    <StyledDashboardArticleImage>
                      <Img src={article.image} alt={article.title} cover />
                    </StyledDashboardArticleImage>
                    <StyledDashboardArticleText>
                      <H6 title={article.title} center />
                      <Text>{article.subTitle}</Text>
                    </StyledDashboardArticleText>
                  </StyledDashboardArticle>
                </a>
              );
            })}
          </StyledDashboardArticlesContainer>
        </StyledDashboardCardContent>
        <Button
          style="custom-secondary-inverted"
          isExternal
          href={toolboxContents[user.role].url}
          newTab
        >
          Voir tous les conseils
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
