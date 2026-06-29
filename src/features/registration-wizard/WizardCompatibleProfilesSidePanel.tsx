import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { PublicProfile } from '@/src/api/types';
import { H3, H5 } from '@/src/components/ui/Headings';
import { LucidIcon } from '@/src/components/ui/Icons';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import {
  selectPreRegistrationPreferences,
  selectRegistrationSelectedFlow,
} from '@/src/use-cases/registration';
import { Api } from 'src/api';
import { Text } from 'src/components/ui/Text';
import { WizardCompatibleProfileCard } from './WizardCompatibleProfileCard';
import {
  StyledContainer,
  StyledCountRow,
  StyledEmptyState,
  StyledEmptyStateText,
  StyledHeader,
  StyledLockBanner,
  StyledProfileList,
  StyledSubtitle,
} from './WizardCompatibleProfilesSidePanel.styles';
import {
  SEARCHING_LOADER_VARIANTS,
  WizardSearchingLoader,
} from './WizardSearchingLoader';

interface WizardCompatibleProfilesSidePanelProps {
  subtitleContext: 'nudges' | 'sectors';
}

const SUBTITLE: Record<'nudges' | 'sectors', string> = {
  nudges: 'Selon les coups de pouce que vous avez choisis',
  sectors: 'Selon les secteurs que vous avez choisis',
};

export const WizardCompatibleProfilesSidePanel = ({
  subtitleContext,
}: WizardCompatibleProfilesSidePanelProps) => {
  const selectedFlow = useSelector(selectRegistrationSelectedFlow);
  const preRegistrationPreferences = useSelector(
    selectPreRegistrationPreferences
  );

  const userRole = selectedFlow
    ? UserRoleByFlow[selectedFlow]
    : UserRoles.CANDIDATE;
  const isCandidate = userRole === UserRoles.CANDIDATE;

  const nudgeIds = preRegistrationPreferences?.nudgeIds ?? [];
  const businessSectorIds = preRegistrationPreferences?.businessSectorIds ?? [];

  const hasAnyCriteria = nudgeIds.length > 0 || businessSectorIds.length > 0;

  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [count, setCount] = useState(0);
  const [broadened, setBroadened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always read latest values inside setTimeout to avoid stale closures
  const latestCallDataRef = useRef({ nudgeIds, businessSectorIds, userRole });
  latestCallDataRef.current = { nudgeIds, businessSectorIds, userRole };

  // Serialize to primitives so the effect only fires when content changes,
  // not on every reference change produced by the reducer
  const nudgeIdsKey = nudgeIds.join(',');
  const businessSectorIdsKey = businessSectorIds.join(',');

  useEffect(() => {
    const latest = latestCallDataRef.current;
    if (!latest.nudgeIds.length && !latest.businessSectorIds.length) {
      setProfiles([]);
      setCount(0);
      setBroadened(false);
      return;
    }

    let cancelled = false;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      const {
        nudgeIds: latestNudgeIds,
        businessSectorIds: latestBusinessSectorIds,
        userRole: latestRole,
      } = latestCallDataRef.current;
      Api.getPreRegistrationCompatibleProfiles({
        role: latestRole,
        nudgeIds: latestNudgeIds,
        businessSectorIds: latestBusinessSectorIds,
      })
        .then(({ data }) => {
          if (!cancelled) {
            setProfiles(data.profiles);
            setCount(data.count);
            setBroadened(data.broadened ?? false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setProfiles([]);
            setCount(0);
            setBroadened(false);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setIsLoading(false);
          }
        });
    }, 300);

    return () => {
      cancelled = true;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [userRole, nudgeIdsKey, businessSectorIdsKey]);

  const isPlural = count !== 1;
  const panelLabel = isCandidate ? 'VOS COACHS' : 'VOS CANDIDATS';
  const countLabel = isCandidate
    ? isPlural
      ? 'coachs prêts à vous soutenir'
      : 'coach prêt à vous soutenir'
    : isPlural
    ? 'candidats qui ont besoin de vous'
    : 'candidat qui a besoin de vous';

  const lockBannerText = isCandidate
    ? 'Finaliser votre inscription pour contacter ces coachs'
    : 'Finaliser votre inscription pour soutenir ces personnes';

  const emptyStateText = isCandidate
    ? 'Des coachs qui connaissent votre métier, prêts à vous donner un coup de pouce dans votre recherche.'
    : 'Des personnes qui cherchent un coup de pouce dans vos domaines.';

  if (!hasAnyCriteria) {
    return (
      <StyledContainer>
        <H5
          title="Répondez à la première question pour voir vos coachs"
          color="white"
        />
        <StyledEmptyState>
          <LucidIcon name="Users" size={40} />
          <StyledEmptyStateText>{emptyStateText}</StyledEmptyStateText>
        </StyledEmptyState>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <Text color="white">{panelLabel}</Text>
        <StyledCountRow>
          <Text size={35} color="white">
            {isLoading ? '...' : count}
          </Text>
          <Text color="white">{countLabel}</Text>
        </StyledCountRow>
        <Text color="gray">{SUBTITLE[subtitleContext]}</Text>
        {broadened && (
          <Text color="white" size={12}>
            {'On a élargi à votre secteur pour vous montrer plus de coachs.'}
          </Text>
        )}
      </StyledHeader>
      <StyledLockBanner>
        <LucidIcon
          name="Lock"
          size={14}
          color={COLORS.darkBlue}
          stroke="bold"
        />
        <Text color="darkBlue" weight="semibold">
          {lockBannerText}
        </Text>
      </StyledLockBanner>
      <StyledProfileList>
        {isLoading ? (
          <WizardSearchingLoader
            {...SEARCHING_LOADER_VARIANTS[
              subtitleContext === 'nudges'
                ? 'preRegistrationCriteria'
                : 'preRegistrationSectors'
            ]}
          />
        ) : (
          profiles.map((profile) => (
            <WizardCompatibleProfileCard
              key={profile.id}
              profile={profile}
              subtitleContext={subtitleContext}
            />
          ))
        )}
      </StyledProfileList>
    </StyledContainer>
  );
};
