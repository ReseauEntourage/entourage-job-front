jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { MessagingCheckinBanner } from './MessagingCheckinBanner';

describe('MessagingCheckinBanner', () => {
  it('invites the user to review the exchange with the other participant', () => {
    render(
      <MessagingCheckinBanner conversationId="conv1" otherFirstName="Awa" />
    );
    expect(screen.getByTestId('messaging-checkin-banner')).toBeInTheDocument();
    expect(
      screen.getByText(/Un mois d’échanges avec Awa, comment ça se passe/)
    ).toBeInTheDocument();
  });

  it('links to the checkin page of the conversation', () => {
    render(
      <MessagingCheckinBanner conversationId="conv1" otherFirstName="Awa" />
    );
    expect(screen.getByText('Faire le bilan →').closest('a')).toHaveAttribute(
      'href',
      '/backoffice/checkin/conv1'
    );
  });
});
