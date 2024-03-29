import React, { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useContextualRole } from '../../useContextualRole';
import {
  StyledDashboardArticle,
  StyledDashboardArticleImage,
  StyledDashboardArticleText,
  StyledDashboardCardContentContainer,
  StyledDashboardCardSubtitle,
  StyledDashboardReadDocumentsArticlesContainer,
} from '../Dashboard.styles';
import { isReadDocument } from 'src/components/partials/pages/Documents/Documents.utils';
import { Card, Img } from 'src/components/utils';
import { H6 } from 'src/components/utils/Headings';
import { Typography } from 'src/components/utils/Typography';
import { DocumentNames } from 'src/constants';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';

export const DashboardReadDocumentsCard = () => {
  const user = useAuthenticatedUser();
  const { contextualRole } = useContextualRole(user.role);
  const [shouldRendCard, setShouldRenderCard] = useState(false);

  const articles = useMemo(
    () => [
      {
        roles: [USER_ROLES.COACH, USER_ROLES.CANDIDATE],
        documentName: DocumentNames.CharteEthique,
        title: 'La charte Ethique Entourage Pro',
        subTitle: 'Découvrez nos valeurs qui vont guider votre accompagnement',
        link: '/charte-ethique',
        image: '/static/img/dashboard-article-charte-ethique.jpeg',
      },
      {
        roles: [USER_ROLES.COACH],
        documentName: DocumentNames.ConseilsPosture,
        title: 'Conseils sur la posture à adopter',
        subTitle:
          'Tout savoir pour soutenir un candidat en situation de précarité',
        link: '/conseils-posture',
        image: '/static/img/dashboard-article-posture.jpeg',
      },
    ],
    []
  );

  useEffect(() => {
    if (
      contextualRole &&
      articles.some(
        (article) =>
          article.roles.includes(contextualRole) &&
          !isReadDocument(user.readDocuments, article.documentName)
      )
    ) {
      setShouldRenderCard(true);
    }
  }, [user, contextualRole, articles]);

  return shouldRendCard ? (
    <Card title="Articles à lire pour commencer sur de bonnes bases">
      <StyledDashboardCardContentContainer>
        <StyledDashboardCardSubtitle>
          <Typography>
            {contextualRole === USER_ROLES.CANDIDATE
              ? 'Nous vous invitons à prendre connaissance de ces documents essentiels pour assurer un accompagnement de qualité'
              : 'Nous vous invitons à prendre connaissance de ces documents essentiels pour garantir à tout un chacun une expérience enrichissante avec Entourage Pro.'}
          </Typography>
        </StyledDashboardCardSubtitle>
        <StyledDashboardReadDocumentsArticlesContainer>
          {articles.map((article) => {
            if (
              (contextualRole && !article.roles.includes(contextualRole)) ||
              isReadDocument(user.readDocuments, article.documentName)
            ) {
              return null;
            }
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
      </StyledDashboardCardContentContainer>
    </Card>
  ) : null;
};
