jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { MessagingSuggestions } from './MessagingSuggestions';

const participants = [
  { id: 'p1', firstName: 'Awa' },
  { id: 'p2', firstName: 'Paul' },
] as any;

function setup({
  role,
  variant,
  newMessage = '',
  profile,
  noUser = false,
}: {
  role?: UserRoles;
  variant?: 'default' | 'quick-replies';
  newMessage?: string;
  profile?: any;
  noUser?: boolean;
} = {}) {
  const store = createTestStore();
  if (!noUser) {
    store.dispatch(
      currentUserActions.fetchUserSucceeded({
        id: 'me',
        firstName: 'Moi',
        role,
      } as any)
    );
  }
  if (profile) {
    store.dispatch(currentUserActions.fetchCurrentProfileSucceeded(profile));
  }
  const onSuggestionClick = jest.fn();
  const onOpenAIAssistant = jest.fn();
  const utils = renderWithProviders(
    <MessagingSuggestions
      newMessage={newMessage}
      onSuggestionClick={onSuggestionClick}
      onOpenAIAssistant={onOpenAIAssistant}
      participants={participants}
      variant={variant}
    />,
    { store }
  );
  return { onSuggestionClick, onOpenAIAssistant, ...utils };
}

describe('MessagingSuggestions', () => {
  afterEach(() => cleanup());

  describe('starter suggestions', () => {
    it('offers six conversation starters to a candidate, signed with their first name', () => {
      const { onSuggestionClick } = setup({ role: UserRoles.CANDIDATE });
      expect(
        screen.getByTestId('messaging-starter-suggestions')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Vous avez besoin d'aide pour vous lancer/)
      ).toBeInTheDocument();
      const items = screen.getAllByTestId('messaging-suggestion-item');
      expect(items).toHaveLength(6);

      fireEvent.click(items[0]);
      expect(onSuggestionClick).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "J'ai besoin d'aide pour affiner mon projet professionnel",
          message: expect.stringContaining('Bonjour Awa, Paul,'),
        })
      );
      expect(onSuggestionClick.mock.calls[0][0].message).toContain(
        "Je m'appelle Moi"
      );
    });

    it('offers four starters to coaches and other non admin roles', () => {
      setup({ role: UserRoles.COACH });
      expect(screen.getAllByTestId('messaging-suggestion-item')).toHaveLength(
        4
      );
    });

    it('offers nothing to admins or without a user', () => {
      const { container } = setup({ role: UserRoles.ADMIN });
      expect(container).toBeEmptyDOMElement();
      cleanup();
      const second = setup({ noUser: true });
      expect(second.container).toBeEmptyDOMElement();
    });

    it('hides the suggestions once the user started writing', () => {
      setup({ role: UserRoles.CANDIDATE, newMessage: 'Bonjour' });
      expect(
        screen.getByTestId('messaging-starter-suggestions')
      ).toBeInTheDocument();
      expect(screen.queryAllByTestId('messaging-suggestion-item')).toHaveLength(
        0
      );
      expect(screen.queryByText(/Vous avez besoin d'aide/)).toBeNull();
    });
  });

  describe('quick replies', () => {
    it('proposes three replies plus the AI assistant chip to a coach', () => {
      const { onSuggestionClick, onOpenAIAssistant } = setup({
        role: UserRoles.COACH,
        variant: 'quick-replies',
      });
      expect(screen.getByTestId('messaging-quick-replies')).toBeInTheDocument();
      const items = screen.getAllByTestId('messaging-suggestion-item');
      expect(items).toHaveLength(4);
      expect(
        screen.getByText('✨ Demander à l’assistant IA')
      ).toBeInTheDocument();

      fireEvent.click(screen.getByText('🙅 Je ne suis pas disponible'));
      expect(onSuggestionClick.mock.calls[0][0].message).toContain(
        'Bonjour Awa, Paul,'
      );
      expect(onOpenAIAssistant).not.toHaveBeenCalled();
    });

    it('opens the AI assistant instead of filling the editor when its chip is clicked', () => {
      const { onSuggestionClick, onOpenAIAssistant } = setup({
        role: UserRoles.COACH,
        variant: 'quick-replies',
      });
      fireEvent.click(screen.getByText('✨ Demander à l’assistant IA'));
      expect(onOpenAIAssistant).toHaveBeenCalledTimes(1);
      expect(onSuggestionClick).not.toHaveBeenCalled();
    });

    it('proposes four replies to a candidate, filled with their search', () => {
      const { onSuggestionClick } = setup({
        role: UserRoles.CANDIDATE,
        variant: 'quick-replies',
        profile: {
          sectorOccupations: [
            {
              occupation: { name: 'Cuisinier' },
              businessSector: { name: 'Restauration' },
            },
          ],
        },
      });
      expect(screen.getAllByTestId('messaging-suggestion-item')).toHaveLength(
        4
      );
      fireEvent.click(screen.getByText('💬 Dire ce que je cherche'));
      expect(onSuggestionClick.mock.calls[0][0].message).toContain(
        'un poste de Cuisinier dans le secteur Restauration'
      );
    });

    it('uses placeholders when the candidate has no occupation yet', () => {
      const { onSuggestionClick } = setup({
        role: UserRoles.CANDIDATE,
        variant: 'quick-replies',
      });
      fireEvent.click(screen.getByText('💬 Dire ce que je cherche'));
      expect(onSuggestionClick.mock.calls[0][0].message).toContain(
        'un poste de [...] dans le secteur [...]'
      );
    });

    it('proposes nothing to other roles', () => {
      const { container } = setup({
        role: UserRoles.ADMIN,
        variant: 'quick-replies',
      });
      expect(container).toBeEmptyDOMElement();
    });

    it('disappears once the user started writing', () => {
      const { container } = setup({
        role: UserRoles.COACH,
        variant: 'quick-replies',
        newMessage: 'a',
      });
      expect(container).toBeEmptyDOMElement();
    });
  });
});
