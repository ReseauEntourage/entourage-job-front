import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupAdminAction, HelpGroupAdminItem } from '@/src/api/types';
import { ContainerWithTextCentered, Section, Text } from '@/src/components/ui';
import { LoadingScreen } from '@/src/features/backoffice/LoadingScreen';
import { HeaderBackoffice } from '@/src/features/headers/HeaderBackoffice';
import { openModal } from '@/src/features/modals/Modal';
import {
  useGetAdminHelpGroupsQuery,
  useRunHelpGroupActionMutation,
} from '@/src/use-cases/help-groups';
import { notificationsActions } from '@/src/use-cases/notifications';
import { HelpGroupAdminTable } from '../HelpGroupAdminTable';
import { EditHelpGroupModal } from '../HelpGroupModals';
import {
  HELP_GROUP_ADMIN_ACTION_LABELS,
  HELP_GROUP_ADMIN_LABELS,
} from '../helpGroupsAdmin.utils';
import {
  StyledHelpGroupAdminTab,
  StyledHelpGroupAdminTabCount,
  StyledHelpGroupAdminTabPanel,
  StyledHelpGroupAdminTabs,
} from './HelpGroupAdminList.styles';

const TABS = [
  {
    key: 'active',
    isDeleted: false,
    label: HELP_GROUP_ADMIN_LABELS.activeTab,
  },
  {
    key: 'deleted',
    isDeleted: true,
    label: HELP_GROUP_ADMIN_LABELS.deletedTab,
  },
] as const;

export function HelpGroupAdminList() {
  const dispatch = useDispatch();
  const [showDeleted, setShowDeleted] = useState(false);
  const {
    data: groups,
    // Result of the current tab only, for its count
    currentData: currentGroups,
    isLoading,
    isError,
  } = useGetAdminHelpGroupsQuery(showDeleted);
  const [runHelpGroupAction] = useRunHelpGroupActionMutation();
  const tabsRef = useRef<HTMLDivElement>(null);

  // Arrow keys move between the tabs, as expected from a tablist
  const onTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    event.preventDefault();
    const nextIsDeleted = !showDeleted;
    setShowDeleted(nextIsDeleted);
    tabsRef.current
      ?.querySelector<HTMLButtonElement>(
        `#help-groups-tab-${nextIsDeleted ? 'deleted' : 'active'}`
      )
      ?.focus();
  };

  const onAction = useCallback(
    async (group: HelpGroupAdminItem, action: HelpGroupAdminAction) => {
      const result = await runHelpGroupAction({ id: group.id, action });
      const label = HELP_GROUP_ADMIN_ACTION_LABELS[action].toLowerCase();
      dispatch(
        notificationsActions.addNotification(
          'error' in result && result.error
            ? {
                type: 'danger',
                message: `Impossible de ${label} le groupe « ${group.name} »`,
              }
            : {
                type: 'success',
                message: `Action « ${label} » effectuée sur « ${group.name} »`,
              }
        )
      );
    },
    [dispatch, runHelpGroupAction]
  );

  return (
    <Section className="custom-page">
      <HeaderBackoffice
        title="Gestion des groupes"
        description="Créez, publiez, épinglez et restaurez les groupes d'entraide"
        cta={{
          label: 'Créer un groupe',
          onClick: () => openModal(<EditHelpGroupModal />),
        }}
      />
      <StyledHelpGroupAdminTabs
        ref={tabsRef}
        role="tablist"
        aria-label={HELP_GROUP_ADMIN_LABELS.tabsLabel}
        onKeyDown={onTabsKeyDown}
      >
        {TABS.map(({ key, isDeleted, label }) => {
          const isActive = isDeleted === showDeleted;
          return (
            <StyledHelpGroupAdminTab
              key={key}
              id={`help-groups-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="help-groups-tabpanel"
              tabIndex={isActive ? 0 : -1}
              $isActive={isActive}
              data-testid={`help-groups-toggle-${key}`}
              onClick={() => setShowDeleted(isDeleted)}
            >
              {label}
              {/* Only the loaded list is counted: no extra request for the
                  count of the other tab */}
              {isActive && currentGroups && (
                <StyledHelpGroupAdminTabCount $isActive={isActive}>
                  {currentGroups.length}
                </StyledHelpGroupAdminTabCount>
              )}
            </StyledHelpGroupAdminTab>
          );
        })}
      </StyledHelpGroupAdminTabs>
      <StyledHelpGroupAdminTabPanel
        id="help-groups-tabpanel"
        role="tabpanel"
        aria-labelledby={`help-groups-tab-${showDeleted ? 'deleted' : 'active'}`}
      >
        {isLoading && <LoadingScreen />}
        {isError && (
          <ContainerWithTextCentered>
            <Text>Les groupes n&apos;ont pas pu être chargés.</Text>
          </ContainerWithTextCentered>
        )}
        {groups && groups.length > 0 && (
          <HelpGroupAdminTable groups={groups} onAction={onAction} />
        )}
        {groups && groups.length === 0 && (
          <ContainerWithTextCentered>
            <Text variant="italic">
              {showDeleted
                ? 'Aucun groupe supprimé'
                : 'Aucun groupe pour le moment'}
            </Text>
          </ContainerWithTextCentered>
        )}
      </StyledHelpGroupAdminTabPanel>
    </Section>
  );
}
