import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Text } from '@/src/components/ui';
import { AlertType } from '@/src/components/ui/Alert/Alert.types';
import {
  EthicsCharterSummary,
  getEthicsCharterSummaries,
} from '@/src/components/ui/EthicsCharter/EthicsCharter';
import { LucidIcon } from '@/src/components/ui/Icons/LucidIcon';
import { COLORS } from '@/src/constants/styles';
import { useIsMobile } from '@/src/hooks/utils';
import {
  StyledMessagingEthicsCharterActions,
  StyledMessagingEthicsCharterBar,
  StyledMessagingEthicsCharterBarLabel,
  StyledMessagingEthicsCharterColumn,
  StyledMessagingEthicsCharterContent,
  StyledMessagingEthicsCharterHeader,
  StyledMessagingEthicsCharterLink,
  StyledMessagingEthicsCharterPanel,
  StyledMessagingEthicsCharterPanelBody,
  StyledMessagingEthicsCharterPanelClose,
  StyledMessagingEthicsCharterPanelFooter,
  StyledMessagingEthicsCharterPanelHeader,
  StyledMessagingEthicsCharterPanelTitle,
  StyledMessagingEthicsCharterPoints,
  StyledMessagingEthicsCharterSection,
  StyledMessagingEthicsCharterSectionBody,
  StyledMessagingEthicsCharterSectionIcon,
  StyledMessagingEthicsCharterSections,
} from './MessagingEthicsCharterBanner.styles';

const TITLE = "Ici, on se parle d'égal à égal";
const INTRO =
  "Pour des échanges respectueux et sincères, voici ce à quoi chacun s'engage ici.";
const CHARTER_LINK_LABEL = 'Voir la charte complète';
const CHARTER_PATH = '/conseils-posture';
const ACKNOWLEDGE_LABEL = "J'ai compris";
const INFO_ICON_SIZE = 22;

/**
 * Répartit les sections en deux colonnes de lecture, la première prenant la
 * section supplémentaire quand le total est impair. Les colonnes vides sont
 * écartées pour que la version desktop reste correcte si la charte venait à
 * ne porter qu'un seul résumé.
 */
const splitInColumns = (
  summaries: EthicsCharterSummary[]
): EthicsCharterSummary[][] => {
  const midpoint = Math.ceil(summaries.length / 2);
  return [summaries.slice(0, midpoint), summaries.slice(midpoint)].filter(
    (column) => column.length > 0
  );
};

const CharterSection = ({ summary }: { summary: EthicsCharterSummary }) => (
  <StyledMessagingEthicsCharterSection>
    <StyledMessagingEthicsCharterSectionIcon>
      <LucidIcon name={summary.icon} color={COLORS.darkTeal} />
    </StyledMessagingEthicsCharterSectionIcon>
    <StyledMessagingEthicsCharterSectionBody>
      <Text weight="semibold" size="small">
        {summary.title}
      </Text>
      <StyledMessagingEthicsCharterPoints>
        {summary.points.map((point) => (
          <li key={point}>
            <Text size="small">{point}</Text>
          </li>
        ))}
      </StyledMessagingEthicsCharterPoints>
    </StyledMessagingEthicsCharterSectionBody>
  </StyledMessagingEthicsCharterSection>
);

const CharterLink = () => (
  <StyledMessagingEthicsCharterLink
    href={CHARTER_PATH}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Text size="small">{CHARTER_LINK_LABEL}</Text>
    <LucidIcon name="ExternalLink" size={14} color={COLORS.extraDarkGray} />
  </StyledMessagingEthicsCharterLink>
);

export const MessagingEthicsCharterBanner = () => {
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const summaries = getEthicsCharterSummaries();

  const barRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    barRef.current?.focus();
  }, []);

  const acknowledge = useCallback(() => {
    setIsPanelOpen(false);
    setVisible(false);
  }, []);

  // Le panneau prend le focus à l'ouverture et le rend à la barre à la
  // fermeture, pour que la navigation au clavier et les lecteurs d'écran
  // suivent l'ouverture. Échap referme sans fermer le rappel.
  useEffect(() => {
    if (!isPanelOpen) {
      return undefined;
    }

    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPanelOpen, closePanel]);

  if (!visible) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <StyledMessagingEthicsCharterBar
          type="button"
          ref={barRef}
          aria-expanded={isPanelOpen}
          onClick={() => setIsPanelOpen(true)}
          data-testid="messaging-ethics-charter-bar"
        >
          <LucidIcon
            name="Info"
            size={INFO_ICON_SIZE}
            color={COLORS.extraDarkGray}
          />
          <StyledMessagingEthicsCharterBarLabel>
            <Text weight="semibold">{TITLE}</Text>
          </StyledMessagingEthicsCharterBarLabel>
          <LucidIcon
            name="ChevronDown"
            size={20}
            color={COLORS.extraDarkGray}
          />
        </StyledMessagingEthicsCharterBar>

        {isPanelOpen && (
          <StyledMessagingEthicsCharterPanel
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={TITLE}
            tabIndex={-1}
            data-testid="messaging-ethics-charter-panel"
          >
            <StyledMessagingEthicsCharterPanelHeader>
              <LucidIcon
                name="Info"
                size={INFO_ICON_SIZE}
                color={COLORS.extraDarkGray}
              />
              <StyledMessagingEthicsCharterPanelTitle>
                <Text weight="semibold" size="large">
                  {TITLE}
                </Text>
                <Text size="small">{INTRO}</Text>
              </StyledMessagingEthicsCharterPanelTitle>
              <StyledMessagingEthicsCharterPanelClose
                type="button"
                onClick={closePanel}
                aria-label="Fermer la charte"
              >
                <LucidIcon name="X" color={COLORS.extraDarkGray} size={20} />
              </StyledMessagingEthicsCharterPanelClose>
            </StyledMessagingEthicsCharterPanelHeader>

            <StyledMessagingEthicsCharterPanelBody>
              {summaries.map((summary) => (
                <CharterSection key={summary.title} summary={summary} />
              ))}
              <CharterLink />
            </StyledMessagingEthicsCharterPanelBody>

            <StyledMessagingEthicsCharterPanelFooter>
              <Button
                variant="default"
                size="large"
                rounded
                onClick={acknowledge}
              >
                {ACKNOWLEDGE_LABEL}
              </Button>
            </StyledMessagingEthicsCharterPanelFooter>
          </StyledMessagingEthicsCharterPanel>
        )}
      </>
    );
  }

  return (
    <Alert
      type={AlertType.Info}
      variant="outlined"
      rounded={false}
      alignTop
      icon={
        <LucidIcon
          name="Info"
          size={INFO_ICON_SIZE}
          color={COLORS.extraDarkGray}
        />
      }
      closable
      onClose={acknowledge}
      dataTestId="messaging-ethics-charter-banner"
    >
      <StyledMessagingEthicsCharterContent>
        <StyledMessagingEthicsCharterHeader>
          <Text weight="semibold">{TITLE}</Text>
          <Text size="small">{INTRO}</Text>
        </StyledMessagingEthicsCharterHeader>

        <StyledMessagingEthicsCharterSections>
          {splitInColumns(summaries).map((column) => (
            <StyledMessagingEthicsCharterColumn key={column[0].title}>
              {column.map((summary) => (
                <CharterSection key={summary.title} summary={summary} />
              ))}
            </StyledMessagingEthicsCharterColumn>
          ))}
        </StyledMessagingEthicsCharterSections>

        <StyledMessagingEthicsCharterActions>
          <Button variant="default" size="small" rounded onClick={acknowledge}>
            {ACKNOWLEDGE_LABEL}
          </Button>
          <CharterLink />
        </StyledMessagingEthicsCharterActions>
      </StyledMessagingEthicsCharterContent>
    </Alert>
  );
};
