import React, { useMemo } from 'react';
import {
  IlluAmpoule,
  IlluCoachEtCandidat,
  IlluCoeurMainsOuvertes,
  IlluCoeurSurLaMain,
  IlluMalette,
  IlluPoigneeDeMain,
} from 'assets/icons/icons';
import {
  Button,
  StyledCenteredButtonContainer,
  Section,
} from 'src/components/utils';
import { H2 } from 'src/components/utils/Headings';
import { Text } from 'src/components/utils/Text';
import { GA_TAGS } from 'src/constants/tags';
import { gaEvent } from 'src/lib/gtag';
import { StyledInsight, StyledInsightsContainer } from './Impact.styles';

export type Role = 'Coach' | 'Candidat' | 'Referer' | 'Company';

export interface ImpactProps {
  gaEventTag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
  role: Role;
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

const contentByRole: { [K in Role]: Content } = {
  Candidat: {
    title: 'Quelques chiffres',
    insights: [
      {
        value: '660',
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
        description: 'des candidats ont développés de nouvelles compétences',
        illu: <IlluAmpoule {...illuSizes} />,
      },
      {
        value: '75%',
        description: 'des candidats sont plus à l’aise en milieu professionnel',
        illu: <IlluCoeurMainsOuvertes {...illuSizes} />,
      },
    ],
  },
  Coach: {
    title: 'Quelques chiffres',
    insights: [
      {
        value: 'XXX',
        description: 'coachs se sont engagés depuis le lancement',
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
        value: '660',
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
        description: 'des candidats ont développés de nouvelles compétences',
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
        value: '440',
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
  role,
  inviteToShowMore = false,
  invertBgColor = false,
}: ImpactProps) => {
  const withIllu = useMemo(() => {
    return contentByRole[role].insights.some((insight) => !!insight.illu);
  }, [role]);

  return (
    <Section style={!invertBgColor ? 'hover-blue' : undefined}>
      <H2 title={contentByRole[role].title} center />
      <StyledInsightsContainer
        withIllu={withIllu}
        invertBgColor={invertBgColor}
      >
        {contentByRole[role].insights.map((insight, index) => (
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
