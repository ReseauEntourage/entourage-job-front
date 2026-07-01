import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { SimpleLink } from 'src/components/ui';
import { Dropdown } from 'src/components/ui/Dropdown/Dropdown';
import { DropdownToggle } from 'src/components/ui/Dropdown/DropdownToggle';
import { LucidIcon } from 'src/components/ui/Icons/LucidIcon';
import { ImgUserProfile } from 'src/components/ui/Images/ImgProfile';
import { COLORS } from 'src/constants/styles';
import { authenticationActions } from 'src/use-cases/authentication';
import {
  selectCurrentUser,
  selectCurrentUserProfile,
} from 'src/use-cases/current-user';

const StyledLoginLink = styled(SimpleLink)<{ $onDark?: boolean }>`
  font-size: 0.9rem;
  white-space: nowrap;
  color: ${({ $onDark }) => ($onDark ? COLORS.white : COLORS.black)};
  opacity: 0.85;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    opacity: 1;
  }
`;

const StyledUserToggle = styled.a<{ $onDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  color: ${({ $onDark }) => ($onDark ? COLORS.white : COLORS.black)} !important;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

/*
 * The parent StyledWizardSidePanel uses `&& * { color: white }` (2x class specificity).
 * This wrapper uses `&&&&` (4x) to override it for the dropdown menu items,
 * which have a white background and need dark text.
 */
const StyledDropdownItemsReset = styled.div`
  &&&& *[class] {
    color: ${COLORS.black};
  }
  &&&& svg {
    color: ${COLORS.black};
    fill: none;
  }
  &&&& *[class]:hover {
    color: ${COLORS.primaryBlue};
    background-color: ${COLORS.hoverBlue};
  }
`;

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
