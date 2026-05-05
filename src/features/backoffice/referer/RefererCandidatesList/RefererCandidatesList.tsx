import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { Section } from '@/src/components/ui';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from '@/src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { LoadingScreen } from '../../LoadingScreen';
import { useCurrentUserReferredUsers } from 'src/hooks/current-user/useCurrentUserReferredUsers';
import { RefererCandidatesTable } from './RefererCandidatesTable/RefererCandidatesTable';
import { RefererCandidatesTableItem } from './RefererCandidatesTable/RefererCandidatesTable.types';

export const RefererCandidatesList = () => {
  const router = useRouter();
  const referredUsers = useCurrentUserReferredUsers();

  const items = useMemo<RefererCandidatesTableItem[]>(
    () =>
      (referredUsers ?? []).map((candidate) => ({
        id: candidate.id,
        name: `${candidate.firstName} ${candidate.lastName}`,
        email: candidate.email,
        coachesContactedCount: `${candidate.coachesContactedCount} coach${
          candidate.coachesContactedCount > 1 ? 's' : ''
        }`,
        referredAt: candidate.referredAt
          ? new Date(candidate.referredAt).toLocaleDateString('fr-FR')
          : '-',
        onboardingCompletedAt: candidate.onboardingCompletedAt
          ? new Date(candidate.onboardingCompletedAt).toLocaleDateString(
              'fr-FR'
            )
          : '-',
      })),
    [referredUsers]
  );

  if (!referredUsers) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <HeaderBackoffice
            title="Suivi de vos candidats orientés"
            description="Retrouvez la liste de tous les candidats que vous avez orientés"
            noSeparator
            cta={{
              label: 'Orienter un candidat',
              onClick: () => {
                router.push('/backoffice/referer/orienter/step-1');
              },
            }}
          />
        </Section>
      </StyledBackgroundedHeaderBackoffice>

      <Section className="custom-page">
        <RefererCandidatesTable items={items} />
      </Section>
    </>
  );
};
