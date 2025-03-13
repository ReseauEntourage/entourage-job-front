import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ButtonIcon } from '../ButtonIcon';
import { Dropdown } from '../Dropdown/Dropdown';
import { LucidIcon } from '../Icons/LucidIcon';
import { ProfileReportUserModal } from 'src/components/backoffice/profile/ProfileReportUserModal/ProfileReportUserModal';
import { openModal } from 'src/components/modals/Modal';
import { selectCurrentUserId } from 'src/use-cases/current-user';
import { StyledUserActionsBtnContainer } from './UserActions.styles';
import { UserActionsProps } from './UserActions.types';

export function UserActions({
  userId,
  openDirection = 'left',
}: UserActionsProps) {
  const currentUserId = useSelector(selectCurrentUserId);
  const ownProfile = useMemo(() => {
    return userId === currentUserId;
  }, [currentUserId, userId]);

  const actions = useMemo(() => {
    const list = [
      {
        name: 'Editer mes informations',
        handler: () => {
          openModal(<ProfileReportUserModal userId={userId} />);
        },
      },
    ];
    if (!ownProfile) {
      list.push({
        name: 'Signaler ce profil',
        handler: () => {
          openModal(<ProfileReportUserModal userId={userId} />);
        },
      });
    }
    return list;
  }, [userId, ownProfile]);

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
