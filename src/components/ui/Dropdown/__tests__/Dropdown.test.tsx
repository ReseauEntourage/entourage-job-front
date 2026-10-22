import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { COLORS } from '@/src/constants/styles';
import { Dropdown } from '../Dropdown';

const onProfile = jest.fn();
const onLogout = jest.fn();

const renderDropdown = (asButton = true) =>
  render(
    <Dropdown>
      <Dropdown.Toggle asButton={asButton} ariaLabel="Menu du compte">
        Compte
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={onProfile} icon={<svg data-testid="icon" />}>
          Mon profil
        </Dropdown.Item>
        <Dropdown.Item onClick={onLogout} color="darkOrange">
          Se déconnecter
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

const getToggle = () => screen.getByRole('button', { name: 'Menu du compte' });

describe('Dropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('as a menu button', () => {
    it('announces a closed menu on a real button', () => {
      renderDropdown();
      expect(getToggle()).toHaveAttribute('aria-haspopup', 'menu');
      expect(getToggle()).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('opens the menu with its entries and updates aria-expanded', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      expect(getToggle()).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(
        screen.getAllByRole('menuitem').map((item) => item.textContent)
      ).toEqual(['Mon profil', 'Se déconnecter']);
    });

    it('lets every entry take the focus', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      screen.getAllByRole('menuitem').forEach((item) => {
        expect(item).toHaveAttribute('tabindex', '0');
      });
    });
  });

  describe('keyboard', () => {
    it('activates an entry with Enter and closes the menu', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      fireEvent.keyDown(screen.getByText('Mon profil'), { key: 'Enter' });
      expect(onProfile).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('activates an entry with Space', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      fireEvent.keyDown(screen.getByText('Se déconnecter'), { key: ' ' });
      expect(onLogout).toHaveBeenCalledTimes(1);
    });

    it('closes with Escape and gives the focus back to the toggle', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      const [firstItem] = screen.getAllByRole('menuitem');
      firstItem.focus();
      fireEvent.keyDown(firstItem, { key: 'Escape' });
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(document.activeElement).toBe(getToggle());
    });

    it('moves the focus with the arrow keys, looping at the ends', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      const [first, second] = screen.getAllByRole('menuitem');
      first.focus();
      fireEvent.keyDown(first, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(second);
      fireEvent.keyDown(second, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(first);
      fireEvent.keyDown(first, { key: 'ArrowUp' });
      expect(document.activeElement).toBe(second);
    });
  });

  describe('entry options', () => {
    it('shows the icon before the label', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('keeps the label color of an entry that sets one', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      expect(screen.getByText('Se déconnecter')).toHaveStyle({
        color: COLORS.darkOrange,
      });
    });

    it('keeps the plain markup of an entry without an icon', () => {
      renderDropdown();
      fireEvent.click(getToggle());
      expect(screen.getByText('Se déconnecter')).toHaveClass('dropdown-item');
      expect(screen.getByText('Se déconnecter').children).toHaveLength(0);
    });
  });

  describe('as before, without asButton', () => {
    it('keeps opening on click on the wrapped content', () => {
      render(
        <Dropdown>
          <Dropdown.Toggle>
            <span>Ouvrir</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Entrée</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
      expect(screen.queryByText('Entrée')).not.toBeInTheDocument();
      fireEvent.click(screen.getByText('Ouvrir'));
      expect(screen.getByText('Entrée')).toBeInTheDocument();
    });

    it('still closes on a click outside', () => {
      renderDropdown(false);
      fireEvent.click(screen.getByText('Compte'));
      expect(screen.getByRole('menu')).toBeInTheDocument();
      fireEvent.mouseDown(document.body);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });
});
