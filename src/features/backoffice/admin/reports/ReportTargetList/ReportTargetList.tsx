import React, { useMemo, type JSX } from 'react';
import {
  Button,
  ContainerWithTextCentered,
  Section,
  Text,
} from '@/src/components/ui';
import { Table, Th } from '@/src/components/ui/Table';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { useGetAdminReportTargetsInfiniteQuery } from '@/src/use-cases/reports';
import { ReportTargetFilters } from '../ReportTargetFilters';
import { ReportTargetRow } from '../ReportTargetRow';
import { REPORTS_TAB_LABELS } from '../reports.labels';
import { useReportFilters } from '../useReportFilters';
import { StyledReportLoadMore } from './ReportTargetList.styles';

/**
 * Reported targets, one row per target: to handle first, then the most
 * recently reported. Filters on type, status and zone.
 */
export function ReportTargetList() {
  const { values, params, setFilter } = useReportFilters();
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetAdminReportTargetsInfiniteQuery(params);

  const targets = useMemo(
    () => data?.pages.flatMap(({ items }) => items) ?? [],
    [data]
  );

  const columns = useMemo<JSX.Element[]>(
    () => [
      <Th key="type">Type</Th>,
      <Th key="label">Contenu signalé</Th>,
      <Th key="zones">Zone</Th>,
      <Th key="pending">À traiter</Th>,
      <Th key="reasons">Motifs</Th>,
      <Th key="last">Dernier signalement</Th>,
      <Th key="status">Statut</Th>,
    ],
    []
  );

  return (
    <Section className="custom-page">
      <HeaderBackoffice
        title={REPORTS_TAB_LABELS.title}
        description={REPORTS_TAB_LABELS.description}
      />
      <ReportTargetFilters values={values} onChange={setFilter} />
      {isLoading && <LoadingScreen />}
      {isError && (
        <ContainerWithTextCentered>
          <Text>{REPORTS_TAB_LABELS.loadError}</Text>
        </ContainerWithTextCentered>
      )}
      {!isLoading && !isError && targets.length > 0 && (
        <Table
          columns={columns}
          dataTestId="report-target-list"
          body={targets.map((target) => (
            <ReportTargetRow
              key={`${target.targetType}-${target.targetId}`}
              target={target}
            />
          ))}
        />
      )}
      {!isLoading && !isError && targets.length === 0 && (
        <ContainerWithTextCentered>
          <Text variant="italic">{REPORTS_TAB_LABELS.empty}</Text>
        </ContainerWithTextCentered>
      )}
      {hasNextPage && (
        <StyledReportLoadMore>
          <Button
            variant="secondary"
            rounded
            disabled={isFetchingNextPage}
            onClick={() => {
              fetchNextPage();
            }}
            dataTestId="report-target-list-more"
          >
            {REPORTS_TAB_LABELS.loadMore}
          </Button>
        </StyledReportLoadMore>
      )}
    </Section>
  );
}
