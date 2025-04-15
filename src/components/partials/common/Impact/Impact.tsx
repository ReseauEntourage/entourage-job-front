import React, { useMemo } from 'react';
import {
  IlluAmpoule,
  IlluCoachEtCandidat,
  IlluCoeurMainsOuvertes,
  IlluCoeurSurLaMain,
  IlluCV,
  IlluMalette,
  IlluPoigneeDeMain,
} from 'assets/icons/icons';
import {
  Button,
  StyledCenteredButtonContainer,
  Section,
} from 'src/components/utils';
import { H3 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledInsight, StyledInsightsContainer } from './Impact.styles';

export type DisplayAs = 'Coach' | 'Candidat' | 'Referer' | 'Company';

export interface ImpactProps {
  gaEventTag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
  as: DisplayAs;
  inviteToShowMore?: boolean;
  invertBgColor?: boolean;
}

export interface Insight {
  value: string;
  description: string;
  illu?: React.ReactNode;
}

export interface Content {
  title: React.ReactNode;
  insights: Insight[];
}

const illuSizes = {
  width: 85,
  height: 85,
};

const contentAs: { [K in DisplayAs]: Content } = {
  Candidat: {
    title: 'Quelques chiffres',
    insights: [
      {
        // https://metabase-analytics.entourage.social/question/1899-stat-total-candidats-engages-kpi-site-entourage-pro
        value: '2500',
        description: 'candidats accompagnés depuis le lancement',
        illu: <IlluPoigneeDeMain {...illuSizes} />,
      },
      {
        value: '67%',
        description: 'des candidats ont retrouvé un emploi',
        illu: <IlluMalette {...illuSizes} />,
      },
      {
        value: '80%',
        description: 'des candidats ont développé de nouvelles compétences',
        illu: <IlluAmpoule {...illuSizes} />,
      },
      {
        value: '75%',
        description: 'des candidats sont plus à l’aise en milieu professionnel',
        illu: <IlluCV {...illuSizes} />,
      },
    ],
  },
  Coach: {
    title: 'Quelques chiffres',
    insights: [
      {
        // https://metabase-analytics.entourage.social/question/1884-stat-total-coachs-engages-kpi-site-entourage-pro
        value: '900',
        description: 'coachs se sont engagé(e)s depuis le lancement',
        illu: <IlluPoigneeDeMain {...illuSizes} />,
      },
      {
        value: '90%',
        description: 'des coachs sont satisfaits de leur expérience',
        illu: <IlluCoeurMainsOuvertes {...illuSizes} />,
      },
      {
        value: '75%',
        description: 'des coachs veulent se réengager',
        illu: <IlluCoachEtCandidat {...illuSizes} />,
      },
      {
        value: '60%',
        description: "des coachs se sentent faire partie d'un collectif",
        illu: <IlluCoeurSurLaMain {...illuSizes} />,
      },
    ],
  },
  Referer: {
    title: 'Quelques chiffres',
    insights: [
      {
        // https://metabase-analytics.entourage.social/question/1899-stat-total-candidats-engages-kpi-site-entourage-pro
        value: '2500',
        description: 'candidats accompagnés depuis le lancement',
        illu: <IlluPoigneeDeMain {...illuSizes} />,
      },
      {
        value: '67%',
        description: 'des candidats ont retrouvé un emploi',
        illu: <IlluMalette {...illuSizes} />,
      },
      {
        value: '80%',
        description: 'des candidats ont développé de nouvelles compétences',
        illu: <IlluAmpoule {...illuSizes} />,
      },
      {
        value: '92%',
        description:
          'des structures sociales sont satisfaites de leur expérience',
        illu: <IlluCoeurSurLaMain {...illuSizes} />,
      },
    ],
  },
  Company: {
    title: (
      <>
        Notre <span className="orange">impact</span> en chiffres
      </>
    ),
    insights: [
      {
        value: '2500',
        description: 'candidat(e)s accompagné(e)s depuis le lancement',
      },
      {
        value: '72%',
        description:
          'des candidat(e)s parvenus au bout du parcours ont retrouvé un travail',
      },
      {
        value: '130',
        description: 'entreprises ont recruté',
      },
      {
        value: '93%',
        description:
          'des candidat(e)s ont repris confiance en eux et en leurs capacités',
      },
    ],
  },
};

export const Impact = ({
  gaEventTag,
  as,
  inviteToShowMore = false,
  invertBgColor = false,
}: ImpactProps) => {
  const withIllu = useMemo(() => {
    return contentAs[as].insights.some((insight) => !!insight.illu);
  }, [as]);

  return (
    <Section style={!invertBgColor ? 'hover-blue' : undefined}>
      <H3 title={contentAs[as].title} center />
      <StyledInsightsContainer
        withIllu={withIllu}
        invertBgColor={invertBgColor}
      >
        {contentAs[as].insights.map((insight, index) => (
          <StyledInsight key={index}>
            {insight.illu}
            <Text color="primaryBlue" size={40} weight="bold" center>
              {insight.value}
            </Text>
            <Text color="darkGray" center>
              {insight.description}
            </Text>
          </StyledInsight>
        ))}
      </StyledInsightsContainer>
      {inviteToShowMore && (
        <StyledCenteredButtonContainer>
          <Button
            style="custom-secondary-inverted"
            href={process.env.URL_MESURE_D_IMPACT}
            isExternal
            newTab
            onClick={() => {
              if (gaEventTag) gaEvent(gaEventTag);
            }}
          >
            Télécharger la mesure d&lsquo;impact
          </Button>
        </StyledCenteredButtonContainer>
      )}
    </Section>
  );
};
