import React from 'react';
import { Section } from '@/src/components/utils';
import { H2 } from '@/src/components/utils/Headings';
import { Metric, MetricCard } from '../../../utils/Metric/Metric';
import {
  StyledMetricsContainer,
  StyledRecruitmentMetricsContainer,
} from './RecruitmentMetrics.styles';

const metrics = [
  {
    title: 'Les biais inconscients freinent l’accès à l’emploi',
    value: '49%',
    description:
      'des candidats issus de minorités ethniques ont moins de chances d’être convoqués à un entretien, à compétences égales.',
    source: 'OCDE, 2023',
    imageUrl: '/static/img/recruitment-metrics/1.jpg',
    bubblePosition: 'top-left',
  },
  {
    title: 'La diversité est un véritable levier de compétitivité',
    value: '36%',
    description:
      'de chances de surperformance financière pour les entreprises les plus diverses socialement et ethniquement.',
    source: 'McKinsey, 2020',
    imageUrl: '/static/img/recruitment-metrics/2.jpg',

    bubblePosition: 'bottom-left',
  },
  {
    title: 'Un enjeu RH stratégique et attendu par les équipes',
    value: '83%',
    description:
      'des salariés aspirent à une meilleure inclusion des personnes en situation d’exclusion dans leur entreprise.',
    source: 'Carenews, 2023',
    imageUrl: '/static/img/recruitment-metrics/3.jpg',
    bubblePosition: 'top-right',
  },
] as Metric[];

export const RecruitmentMetrics = () => {
  return (
    <Section container="large">
      <StyledRecruitmentMetricsContainer>
        <H2 center title="Un enjeu incontournable" />

        <StyledMetricsContainer>
          {metrics.map((metric) => (
            <MetricCard metric={metric} key={metric.title} />
          ))}
        </StyledMetricsContainer>
      </StyledRecruitmentMetricsContainer>
    </Section>
  );
};
