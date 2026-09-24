import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import '@testing-library/jest-dom';
import {
  AI_MESSAGE_STATUS_NOTICES,
  AssistantMessageBubble,
  parseSegments,
} from './AssistantMessageBubble';

// The component barrel (@/src/components/ui) transitively imports the
// ESM-only @react-hook/window-size (cf. useEmailConfirmationPhase.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

describe('parseSegments', () => {
  it('splits text and a closed suggestion block', () => {
    expect(
      parseSegments('Voici un message :\n[SUGGESTION]Bonjour Awa[/SUGGESTION]')
    ).toEqual([
      { type: 'text', content: 'Voici un message :' },
      { type: 'suggestion', content: 'Bonjour Awa' },
    ]);
  });

  it('hides an unclosed suggestion block while streaming', () => {
    expect(
      parseSegments('Voici un message :\n[SUGGESTION]Bonjour A', true)
    ).toEqual([{ type: 'text', content: 'Voici un message :' }]);
  });

  it('shows an unclosed suggestion block as plain text once the answer is over', () => {
    expect(
      parseSegments('Voici un message :\n[SUGGESTION]Bonjour A', false)
    ).toEqual([{ type: 'text', content: 'Voici un message :\nBonjour A' }]);
  });
});

describe('AssistantMessageBubble', () => {
  it('does not offer a suggestion button for an unclosed block once the answer is over', () => {
    render(
      <AssistantMessageBubble
        content={'Proposition :\n[SUGGESTION]Bonjour Awa, je'}
      />
    );

    expect(screen.getByText(/Bonjour Awa, je/)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows the truncated notice', () => {
    render(
      <AssistantMessageBubble content="Réponse coupée" status="truncated" />
    );

    expect(
      screen.getByText(AI_MESSAGE_STATUS_NOTICES.truncated)
    ).toBeInTheDocument();
  });

  it('shows the interrupted notice and keeps the received text', () => {
    render(
      <AssistantMessageBubble content="Début reçu" status="interrupted" />
    );

    expect(screen.getByText('Début reçu')).toBeInTheDocument();
    expect(
      screen.getByText(AI_MESSAGE_STATUS_NOTICES.interrupted)
    ).toBeInTheDocument();
  });

  it('shows no notice without a status', () => {
    render(<AssistantMessageBubble content="Réponse complète" />);

    expect(
      screen.queryByText(AI_MESSAGE_STATUS_NOTICES.truncated)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(AI_MESSAGE_STATUS_NOTICES.interrupted)
    ).not.toBeInTheDocument();
  });
});
