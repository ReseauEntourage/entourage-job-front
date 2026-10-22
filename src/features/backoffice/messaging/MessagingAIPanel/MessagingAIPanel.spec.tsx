jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('./MessagingAIAssistant', () => ({
  MessagingAIAssistant: () => <div data-testid="assistant" />,
}));

import { cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { messagingActions } from '@/src/use-cases/messaging';
import { MessagingAIPanel } from './MessagingAIPanel';

describe('MessagingAIPanel', () => {
  afterEach(() => cleanup());

  it('shows the assistant tab and its content', () => {
    renderWithProviders(<MessagingAIPanel />);
    expect(screen.getByText('Assistant Coach')).toBeInTheDocument();
    expect(screen.getByTestId('assistant')).toBeInTheDocument();
  });

  it('selects the AI view and opens the panel when clicking its tab', () => {
    const store = createTestStore();
    renderWithProviders(<MessagingAIPanel />, { store });
    expect(store.getState().messaging.isAIPanelOpen).toBe(false);
    fireEvent.click(screen.getByText('Assistant Coach'));
    expect(store.getState().messaging.activePanelView).toBe('ai');
    expect(store.getState().messaging.isAIPanelOpen).toBe(true);
  });

  it('closes the panel with the close button', () => {
    const store = createTestStore();
    store.dispatch(messagingActions.setIsAIPanelOpen(true));
    const { container } = renderWithProviders(<MessagingAIPanel />, { store });
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[buttons.length - 1]);
    expect(store.getState().messaging.isAIPanelOpen).toBe(false);
  });
});
