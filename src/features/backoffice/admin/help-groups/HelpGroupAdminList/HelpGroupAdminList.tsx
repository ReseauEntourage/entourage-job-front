import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HelpGroupAdminAction, HelpGroupAdminItem } from '@/src/api/types';
import {
  Button,
  ContainerWithTextCentered,
  Section,
  Text,
} from '@/src/components/ui';
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
import { HELP_GROUP_ADMIN_ACTION_LABELS } from '../helpGroupsAdmin.utils';
import { StyledHelpGroupAdminToggle } from './HelpGroupAdminList.styles';

export function HelpGroupAdminList() {
  const dispatch = useDispatch();
  const [showDeleted, setShowDeleted] = useState(false);
  const {
    data: groups,
    isLoading,
    isError,
  } = useGetAdminHelpGroupsQuery(showDeleted);
  const [runHelpGroupAction] = useRunHelpGroupActionMutation();

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
      <StyledHelpGroupAdminToggle>
        <Button
          size="small"
          variant={showDeleted ? 'default' : 'primary'}
          dataTestId="help-groups-toggle-active"
          onClick={() => setShowDeleted(false)}
        >
          Groupes
        </Button>
        <Button
          size="small"
          variant={showDeleted ? 'primary' : 'default'}
          dataTestId="help-groups-toggle-deleted"
          onClick={() => setShowDeleted(true)}
        >
          Supprimés
        </Button>
      </StyledHelpGroupAdminToggle>
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
    </Section>
  );
}
