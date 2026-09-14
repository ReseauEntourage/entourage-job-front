import React, { useMemo } from 'react';
import {
  Button,
  StyledCenteredButtonContainer,
  Section,
} from '@/src/components/ui';
import { H2 } from '@/src/components/ui/Headings';
import { Text } from '@/src/components/ui/Text';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import {
  StyledImpactBackground,
  StyledImpactContainer,
  StyledInsight,
  StyledInsightsContainer,
} from './Impact.styles';

export interface ImpactInsight {
  value: string;
  description: string;
  illu?: React.ReactNode;
}

interface ImpactProps {
  title: React.ReactNode;
  insights: ImpactInsight[];
  gaEventTag?: (typeof GA_TAGS)[keyof typeof GA_TAGS];
  inviteToShowMore?: boolean;
  invertBgColor?: boolean;
}

export const Impact = ({
  title,
  insights,
  gaEventTag,
  inviteToShowMore = false,
  invertBgColor = false,
}: ImpactProps) => {
  const withIllu = useMemo(
    () => insights.some((insight) => !!insight.illu),
    [insights]
  );

  return (
    <StyledImpactBackground>
      <Section className="custom-page">
        <H2 title={title} center color="white" />
        <StyledImpactContainer>
          <StyledInsightsContainer
            $withIllu={withIllu}
            $invertBgColor={invertBgColor}
            $nbColumns={insights.length}
          >
            {insights.map((insight, index) => (
              <StyledInsight key={index}>
                {insight.illu}
                <Text color="primaryBlue" size={40} weight="bold" center>
                  {insight.value}
                </Text>
                <Text color="darkGray" center size="large">
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
