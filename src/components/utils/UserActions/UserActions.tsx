import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { UserRoles } from '@/src/constants/users';
import { useHeaderProfile } from '../../headers/HeaderProfile/useHeaderProfile';
import { ButtonIcon } from '../Button';
import { Dropdown } from '../Dropdown/Dropdown';
import { LucidIcon } from '../Icons/LucidIcon';
import { ProfileReportUserModal } from 'src/components/backoffice/profile/ProfileReportUserModal/ProfileReportUserModal';
import { openModal } from 'src/components/modals/Modal';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { StyledUserActionsBtnContainer } from './UserActions.styles';

export interface UserActionsProps {
  userId: string;
  userRole: UserRoles;
  openDirection?: 'left' | 'right';
}

export function UserActions({
  userId,
  userRole,
  openDirection = 'left',
}: UserActionsProps) {
  const { openCorrespondingModal } = useHeaderProfile(userRole);
  const currentUserId = useSelector(selectCurrentUserId);
  const ownProfile = useMemo(() => {
    return userId === currentUserId;
  }, [currentUserId, userId]);

  const actions = useMemo(() => {
    const list: {
      name: string;
      handler: () => void;
    }[] = [];

    if (ownProfile) {
      list.push({
        name: 'Éditer mes informations',
        handler: () => {
          openCorrespondingModal();
        },
      });
    }
    if (!ownProfile) {
      list.push({
        name: 'Signaler ce profil',
        handler: () => {
          openModal(<ProfileReportUserModal userId={userId} />);
        },
      });
    }
    return list;
  }, [ownProfile, openCorrespondingModal, userId]);

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle>
          <StyledUserActionsBtnContainer>
            <ButtonIcon
              icon={<LucidIcon name="Ellipsis" />}
              onClick={() => {}}
            />
          </StyledUserActionsBtnContainer>
        </Dropdown.Toggle>
        <Dropdown.Menu openDirection={openDirection}>
          {actions.map((action, idx) => (
            <Dropdown.Item onClick={action.handler} key={`item-${idx}`}>
              {action.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}
