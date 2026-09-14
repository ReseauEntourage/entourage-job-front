import React, { useMemo } from 'react';
import {
  Button,
  StyledCenteredButtonContainer,
  Section,
} from '@/src/components/ui';
import { H3 } from '@/src/components/ui/Headings';
import { SvgIcon } from '@/src/components/ui/SvgIcon/SvgIcon';
import { Text } from '@/src/components/ui/Text';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import {
  StyledImpactBackground,
  StyledImpactContainer,
  StyledInsight,
  StyledInsightsContainer,
} from './Impact.styles';

type DisplayAs = 'Coach' | 'Candidat' | 'Referer' | 'Company';

interface ImpactProps {
  gaEventTag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
  as: DisplayAs;
  inviteToShowMore?: boolean;
  invertBgColor?: boolean;
}

interface Insight {
  value: string;
  description: string;
  illu?: React.ReactNode;
}

interface Content {
  title: React.ReactNode;
  insights: Insight[];
}

const illuSizes = {
  width: 85,
  height: 85,
};

const contentAs: { [K in DisplayAs]: Content } = {
  Candidat: {
    title: 'Notre impact',
    insights: [
      {
        value: '3 000',
        description: 'coachs engagés sur la plateforme',
        illu: <SvgIcon name="IlluBulleQuestion" {...illuSizes} />,
      },
      {
        value: '81%',
        description: 'des candidats ont rencontrés de nouvelles personnes',
        illu: <SvgIcon name="IlluBulleQuestion" {...illuSizes} />,
      },
      {
        value: '89%',
        description: 'des candidats disent se sentir mieux',
        illu: <SvgIcon name="IlluBulleQuestion" {...illuSizes} />,
      },
      {
        value: '83%',
        description: 'ont développé de nouvelles compétences',
        illu: <SvgIcon name="IlluBulleQuestion" {...illuSizes} />,
      },
    ],
  },
  Coach: {
    title: 'Quelques chiffres',
    insights: [
      {
        value: '6 000',
        description: 'candidats sur la plateforme',
        illu: <SvgIcon name="IlluBulleQuestion" {...illuSizes} />,
      },
      {
        value: '97%',
        description:
          'des coachs déclarent que leur regard a changé positivement',
        illu: <SvgIcon name="IlluBulleQuestion" {...illuSizes} />,
      },
      {
        value: '75%',
        description: "des coachs ont un sentiment d'utilité",
        illu: <SvgIcon name="IlluBulleQuestion" {...illuSizes} />,
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
        illu: <SvgIcon name="IlluPoigneeDeMain" {...illuSizes} />,
      },
      {
        value: '67%',
        description: 'des candidats ont retrouvé un emploi',
        illu: <SvgIcon name="IlluMalette" {...illuSizes} />,
      },
      {
        value: '80%',
        description: 'des candidats ont développé de nouvelles compétences',
        illu: <SvgIcon name="IlluAmpoule" {...illuSizes} />,
      },
      {
        value: '92%',
        description:
          'des structures sociales sont satisfaites de leur expérience',
        illu: <SvgIcon name="IlluCoeurSurLaMain" {...illuSizes} />,
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
        value: '81%',
        description: 'des personnes disent se sentir mieux',
        illu: <SvgIcon name="IlluPoigneeDeMain" {...illuSizes} />,
      },
      {
        value: '500',
        description: 'entreprises partenaires',
        illu: <SvgIcon name="IlluMalette" {...illuSizes} />,
      },
      {
        value: '19 000',
        description: 'personnes sensibilisées',
        illu: <SvgIcon name="IlluCoeurSurLaMain" {...illuSizes} />,
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
    <StyledImpactBackground>
      <Section className="custom-page">
        <H3 title={contentAs[as].title} center />
        <StyledImpactContainer>
          <StyledInsightsContainer
            $withIllu={withIllu}
            $invertBgColor={invertBgColor}
            $nbColumns={contentAs[as].insights.length}
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
                variant="primary"
                rounded
                href={process.env.NEXT_PUBLIC_URL_MESURE_D_IMPACT}
                isExternal
                newTab
                onClick={() => {
                  if (gaEventTag) {
                    gaEvent(gaEventTag);
                  }
                }}
              >
                Télécharger la mesure d&lsquo;impact
              </Button>
            </StyledCenteredButtonContainer>
          )}
        </StyledImpactContainer>
      </Section>
    </StyledImpactBackground>
  );
};
