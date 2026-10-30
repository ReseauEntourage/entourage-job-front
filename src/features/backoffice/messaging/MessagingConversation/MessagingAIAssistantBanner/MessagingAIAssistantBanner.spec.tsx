import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import '@testing-library/jest-dom';
import { MessagingAIAssistantBanner } from './MessagingAIAssistantBanner';

// The component barrel (@/src/components/ui) transitively imports the
// ESM-only @react-hook/window-size (cf. useEmailConfirmationPhase.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

describe('MessagingAIAssistantBanner', () => {
  it('shows the title and both buttons on desktop', () => {
    render(
      <MessagingAIAssistantBanner
        onOpenAssistant={() => {}}
        onDismiss={() => {}}
      />
    );

    expect(
      screen.getByText("Besoin d'aide pour répondre ?")
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: "Ouvrir l'assistant" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Non merci' })
    ).toBeInTheDocument();
  });

  it('calls onOpenAssistant when "Ouvrir l\'assistant" is clicked', () => {
    const onOpenAssistant = jest.fn();
    render(
      <MessagingAIAssistantBanner
        onOpenAssistant={onOpenAssistant}
        onDismiss={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: "Ouvrir l'assistant" }));

    expect(onOpenAssistant).toHaveBeenCalledTimes(1);
  });

  it('calls onDismiss when "Non merci" is clicked', () => {
    const onDismiss = jest.fn();
    render(
      <MessagingAIAssistantBanner
        onOpenAssistant={() => {}}
        onDismiss={onDismiss}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Non merci' }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders a compact single-line layout with "Ouvrir" and a dismiss cross on mobile', () => {
    const onDismiss = jest.fn();
    render(
      <MessagingAIAssistantBanner
        onOpenAssistant={() => {}}
        onDismiss={onDismiss}
        compact
      />
    );

    expect(
      screen.getByText("Besoin d'aide pour répondre ?")
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ouvrir' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Non merci' })
    ).not.toBeInTheDocument();

    // The dismiss cross is Alert's icon-only `closable` button: it has no
    // accessible name, unlike "Ouvrir".
    const buttons = screen.getAllByRole('button');
    const crossButton = buttons.find((button) => button.textContent === '');
    expect(crossButton).toBeDefined();
    fireEvent.click(crossButton as HTMLElement);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
