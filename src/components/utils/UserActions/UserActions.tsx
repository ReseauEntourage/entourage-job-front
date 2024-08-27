import React from 'react';
import MoreIcon from 'assets/icons/more.svg';
import { ButtonIcon } from '../ButtonIcon';
import { Dropdown } from '../Dropdown/Dropdown';
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
              icon={<MoreIcon width={20} height={20} />}
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
