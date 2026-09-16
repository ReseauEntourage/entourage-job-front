jest.mock('@/src/api');

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import '@testing-library/jest-dom';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { AppVersion } from './AppVersion';

const mockedApi = getMockedApi();

function openTooltip() {
  fireEvent.mouseEnter(screen.getByText("Version d'Entourage Pro"));
}

describe('AppVersion', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_VERSION: '2.25.2',
      NEXT_PUBLIC_HEROKU_RELEASE_VERSION: 'v588',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('shows the trigger text without exposing versions upfront', () => {
    mockedApi.getVersion.mockReturnValue(new Promise(() => {}));

    render(<AppVersion />);

    expect(screen.getByText("Version d'Entourage Pro")).toBeInTheDocument();
    expect(
      screen.queryByText('Version Front : v2.25.2 (v588)')
    ).not.toBeInTheDocument();
  });

  it('displays the front version in the tooltip, from build-time env vars', () => {
    mockedApi.getVersion.mockReturnValue(new Promise(() => {}));

    render(<AppVersion />);
    openTooltip();

    expect(
      screen.getByText('Version Front : v2.25.2 (v588)')
    ).toBeInTheDocument();
  });

  it('falls back to "dev" for the front release when unset', () => {
    process.env.NEXT_PUBLIC_HEROKU_RELEASE_VERSION = '';
    mockedApi.getVersion.mockReturnValue(new Promise(() => {}));

    render(<AppVersion />);
    openTooltip();

    expect(
      screen.getByText('Version Front : v2.25.2 (dev)')
    ).toBeInTheDocument();
  });

  it('displays the back version once the API call resolves', async () => {
    mockedApi.getVersion.mockResolvedValue({
      data: { version: '2.32.2', release: 'v568' },
    } as any);

    render(<AppVersion />);
    openTooltip();

    await waitFor(() => {
      expect(
        screen.getByText('Version Back : v2.32.2 (v568)')
      ).toBeInTheDocument();
    });
  });

  it('shows "dev" for the back release when the API returns null', async () => {
    mockedApi.getVersion.mockResolvedValue({
      data: { version: '2.32.2', release: null },
    } as any);

    render(<AppVersion />);
    openTooltip();

    await waitFor(() => {
      expect(
        screen.getByText('Version Back : v2.32.2 (dev)')
      ).toBeInTheDocument();
    });
  });

  it('shows an explicit unavailability message when the API call fails', async () => {
    mockedApi.getVersion.mockRejectedValue(new Error('network error'));

    render(<AppVersion />);
    openTooltip();

    await waitFor(() => {
      expect(
        screen.getByText('Version Back : indisponible')
      ).toBeInTheDocument();
    });
  });
});
