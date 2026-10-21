jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { MessagingPinnedInfo } from './MessagingPinnedInfo';

describe('MessagingPinnedInfo', () => {
  afterEach(() => cleanup());

  it('explains that the addressee is unavailable', () => {
    render(<MessagingPinnedInfo pinnedInfo="ADDRESSEE_UNAVAILABLE" />);
    expect(
      screen.getByText(/Cet utilisateur n’est plus disponible/)
    ).toBeInTheDocument();
  });

  it('explains that the addressee profile was deleted', () => {
    render(<MessagingPinnedInfo pinnedInfo="ADDRESSEE_DELETED" />);
    expect(
      screen.getByText(/vous ne pouvez plus lui envoyer de message/)
    ).toBeInTheDocument();
  });
});
