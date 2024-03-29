import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  StyledDashboardArticle,
  StyledDashboardArticleImage,
  StyledDashboardArticleText,
  StyledDashboardCardContent,
  StyledDashboardCardContentContainer,
  StyledDashboardCardSubtitle,
  StyledDashboardReadDocumentsArticlesContainer,
} from '../Dashboard.styles';
import { Button, Card, Img } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings'; // TODO Replace with real articles
import { Typography } from 'src/components/utils/Typography';
import { NormalUserRole, USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser'; // TODO Replace with real articles

// TODO Replace with real articles
const testArticles = [
  {
    title: 'La charte Ethique Entourage Pro',
    subTitle: 'Découvrez nos valeurs qui vont guider votre accompagnement',
    link: '/charte-ethique',
    image: '/static/img/dashboard-article-charte-ethique.jpeg',
  },
  {
    title: 'Conseils sur la posture à adopter',
    subTitle: 'Tout savoir pour soutenir un candidat en situation de précarité',
    link: '/conseils-posture',
    image: '/static/img/dashboard-article-posture.jpeg',
  },
];

const toolboxContents: {
  [K in NormalUserRole]: {
    subtitle: string;
    url: string;
    articles: {
      title: string;
      subTitle: string;
      link: string;
      image: string;
    }[];
  };
} = {
  [USER_ROLES.CANDIDATE]: {
    subtitle:
      'Découvrez les contenus pédagogiques pour booster vos opportunités professionnelles',
    url: process.env.TOOLBOX_CANDIDAT_URL as string,
    articles: testArticles,
  },
  [USER_ROLES.COACH]: {
    subtitle:
      'Découvrez les contenus pédagogiques pour vous orienter dans votre rôle de coach',
    url: process.env.TOOLBOX_COACH_URL as string,
    articles: testArticles,
  },
};

export const DashboardToolboxCard = () => {
  const user = useAuthenticatedUser();

  return (
    <Card title="Guides et conseils">
      <StyledDashboardCardContentContainer>
        <StyledDashboardCardSubtitle>
          <Typography>{toolboxContents[user.role].subtitle}</Typography>
        </StyledDashboardCardSubtitle>
        <StyledDashboardCardContent>
          <StyledDashboardReadDocumentsArticlesContainer>
            {toolboxContents[user.role].articles.map((article) => {
              const uuidValue = uuid();
              return (
                <a
                  key={uuidValue}
                  href={article.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <StyledDashboardArticle>
                    <StyledDashboardArticleImage>
                      <Img src={article.image} alt={article.title} cover />
                    </StyledDashboardArticleImage>
                    <StyledDashboardArticleText>
                      <H6 title={article.title} center />
                      <Typography>{article.subTitle}</Typography>
                    </StyledDashboardArticleText>
                  </StyledDashboardArticle>
                </a>
              );
            })}
          </StyledDashboardReadDocumentsArticlesContainer>
        </StyledDashboardCardContent>
        <Button
          style="custom-secondary-inverted"
          isExternal
          href={toolboxContents[user.role].url}
        >
          Voir tous les conseils
        </Button>
      </StyledDashboardCardContentContainer>
    </Card>
  );
};
