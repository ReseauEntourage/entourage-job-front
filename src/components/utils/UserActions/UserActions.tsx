import React from 'react';
import { ButtonIcon } from '../ButtonIcon';
import { Dropdown } from '../Dropdown/Dropdown';
import { LucidIcon } from '../Icons/LucidIcon';
import { ProfileReportUserModal } from 'src/components/backoffice/profile/ProfileReportUserModal/ProfileReportUserModal';
import { openModal } from 'src/components/modals/Modal';
import { StyledUserActionsBtnContainer } from './UserActions.styles';
import { UserActionsProps } from './UserActions.types';

export function UserActions({
  userId,
  openDirection = 'left',
}: UserActionsProps) {
  const actions = [
    {
      name: 'Signaler ce profil',
      handler: () => {
        openModal(<ProfileReportUserModal userId={userId} />);
      },
    },
  ];

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle>
          <StyledUserActionsBtnContainer>
            <ButtonIcon
              icon={<LucidIcon name="Ellipsis" size={20} />}
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
