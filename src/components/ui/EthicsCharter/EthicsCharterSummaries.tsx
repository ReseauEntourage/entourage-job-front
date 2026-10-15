import React from 'react';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import { BulletListElement, List } from '../Lists';
import { Text } from '../Text';
import {
  EthicsCharterSummary,
  getEthicsCharterSummaries,
} from './EthicsCharter';
import {
  StyledEthicsCharterSummaries,
  StyledEthicsCharterSummary,
  StyledEthicsCharterSummaryBody,
  StyledEthicsCharterSummaryIcon,
  StyledEthicsCharterSummaryPoints,
} from './EthicsCharterSummaries.styles';

export const ETHICS_CHARTER_SUMMARIES_TITLE = "Ici, on se parle d'égal à égal";
export const ETHICS_CHARTER_SUMMARIES_INTRO =
  "Pour des échanges respectueux et sincères, voici ce à quoi chacun s'engage ici.";

const EthicsCharterSummaryItem = ({
  summary,
}: {
  summary: EthicsCharterSummary;
}) => (
  <StyledEthicsCharterSummary>
    <StyledEthicsCharterSummaryIcon>
      <LucidIcon name={summary.icon} color={COLORS.darkTeal} />
    </StyledEthicsCharterSummaryIcon>
    <StyledEthicsCharterSummaryBody>
      <Text weight="semibold">{summary.title}</Text>
      <StyledEthicsCharterSummaryPoints>
        <List>
          {summary.points.map((point) => (
            <BulletListElement key={point}>
              <Text>{point}</Text>
            </BulletListElement>
          ))}
        </List>
      </StyledEthicsCharterSummaryPoints>
    </StyledEthicsCharterSummaryBody>
  </StyledEthicsCharterSummary>
);

/**
 * The ethics charter summary, section by section: the content of the
 * messaging reminder modal, reused as the speaking frame of the help groups.
 */
export const EthicsCharterSummaries = () => (
  <StyledEthicsCharterSummaries data-testid="ethics-charter-summaries">
    {getEthicsCharterSummaries().map((summary) => (
      <EthicsCharterSummaryItem key={summary.title} summary={summary} />
    ))}
  </StyledEthicsCharterSummaries>
);
