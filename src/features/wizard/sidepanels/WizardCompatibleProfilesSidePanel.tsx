import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PublicProfile } from '@/src/api/types';
import { LucidIcon } from '@/src/components/ui/Icons';
import { SidePanel } from '@/src/components/ui/SidePanel';
import { COLORS } from '@/src/constants/styles';
import { UserRoles } from '@/src/constants/users';
import { UserRoleByFlow } from '@/src/features/registration/registration.config';
import {
  registrationActions,
  selectPreRegistrationPreferences,
  selectRegistrationSelectedFlow,
} from '@/src/use-cases/registration';
import {
  SEARCHING_LOADER_VARIANTS,
  WizardSearchingLoader,
} from '../components/WizardSearchingLoader';
import { Api } from 'src/api';
import { Text } from 'src/components/ui/Text';
import { WizardCompatibleProfileCard } from './WizardCompatibleProfileCard';
import {
  StyledCompactContent,
  StyledCountRow,
  StyledEmptyState,
  StyledEmptyStateText,
  StyledLockBanner,
  StyledPanelContent,
  StyledProfileList,
} from './WizardCompatibleProfilesSidePanel.styles';

interface WizardCompatibleProfilesSidePanelProps {
  subtitleContext: 'nudges' | 'sectors';
  mode?: 'compact' | 'full';
}

const SUBTITLE: Record<'nudges' | 'sectors', string> = {
  nudges: 'Selon les coups de pouce que vous avez choisis',
  sectors: 'Selon les secteurs que vous avez choisis',
};

export const WizardCompatibleProfilesSidePanel = ({
  subtitleContext,
  mode = 'full',
}: WizardCompatibleProfilesSidePanelProps) => {
  const dispatch = useDispatch();
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
            dispatch(
              registrationActions.setCompatibleProfilesCount(data.count)
            );
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
  }, [userRole, nudgeIdsKey, businessSectorIdsKey, dispatch]);

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

  if (mode === 'compact') {
    if (!hasAnyCriteria) {
      return (
        <StyledCompactContent>
          <StyledCountRow>
            <LucidIcon name="Users" size={20} />
            <Text size="large">
              {isCandidate
                ? 'Répondez pour voir vos coachs'
                : 'Répondez pour voir vos candidats'}
            </Text>
          </StyledCountRow>
        </StyledCompactContent>
      );
    }

    return (
      <StyledCompactContent>
        <StyledCountRow>
          <Text size={35}>{isLoading ? '...' : count}</Text>
          <Text size="large">{countLabel}</Text>
        </StyledCountRow>
      </StyledCompactContent>
    );
  }

  if (!hasAnyCriteria) {
    return (
      <SidePanel
        title={panelLabel}
        subtitle={
          <Text size="xlarge">
            Répondez à la première question pour voir vos coachs
          </Text>
        }
      >
        <StyledEmptyState>
          <LucidIcon name="Users" size={40} />
          <StyledEmptyStateText>{emptyStateText}</StyledEmptyStateText>
        </StyledEmptyState>
      </SidePanel>
    );
  }

  return (
    <SidePanel
      title={panelLabel}
      subtitle={
        <>
          <StyledCountRow>
            <Text size={35}>{isLoading ? '...' : count}</Text>
            <Text size="large">{countLabel}</Text>
          </StyledCountRow>
          <Text color="mediumGray">{SUBTITLE[subtitleContext]}</Text>
          {broadened && (
            <Text size={12}>
              {'On a élargi à votre secteur pour vous montrer plus de coachs.'}
            </Text>
          )}
        </>
      }
    >
      <StyledPanelContent>
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
      </StyledPanelContent>
    </SidePanel>
  );
};
