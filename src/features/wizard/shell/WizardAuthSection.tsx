import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'src/components/ui/Dropdown/Dropdown';
import { DropdownToggle } from 'src/components/ui/Dropdown/DropdownToggle';
import { LucidIcon } from 'src/components/ui/Icons/LucidIcon';
import { ImgUserProfile } from 'src/components/ui/Images/ImgProfile';
import { authenticationActions } from 'src/use-cases/authentication';
import {
  selectCurrentUser,
  selectCurrentUserProfile,
} from 'src/use-cases/current-user';
import {
  StyledDropdownItemsReset,
  StyledLoginLink,
  StyledUserToggle,
} from './WizardAuthSection.styles';

interface WizardAuthSectionProps {
  onDark?: boolean;
}

export const WizardAuthSection = ({
  onDark = true,
}: WizardAuthSectionProps) => {
  const user = useSelector(selectCurrentUser);
  const profile = useSelector(selectCurrentUserProfile);
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    dispatch(authenticationActions.logoutRequested());
  }, [dispatch]);

  if (!user) {
    return (
      <StyledLoginLink href="/login" $onDark={onDark}>
        <LucidIcon name="LogIn" size={16} />
        Se connecter
      </StyledLoginLink>
    );
  }

  return (
    <Dropdown>
      <DropdownToggle>
        <StyledUserToggle $onDark={onDark}>
          <ImgUserProfile
            user={user}
            size={32}
            hasPicture={profile?.hasPicture || false}
          />
          <span>Bonjour {user.firstName}</span>
          <LucidIcon name="ChevronDown" size={16} />
        </StyledUserToggle>
      </DropdownToggle>
      <Dropdown.Menu openDirection="right">
        <StyledDropdownItemsReset>
          <Dropdown.Item onClick={logout}>
            <LucidIcon name="LogOut" size={16} />
            &nbsp;Se déconnecter
          </Dropdown.Item>
        </StyledDropdownItemsReset>
      </Dropdown.Menu>
    </Dropdown>
  );
};
