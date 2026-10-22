import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { LinkedInSharePreviewModal } from './LinkedInSharePreviewModal';

jest.mock('@/src/api', () => ({
  Api: {
    getProfileShareText: jest.fn(),
    postLinkedinShare: jest.fn(),
  },
}));

jest.mock('./LinkedInMentionEditor', () => ({
  LinkedInMentionEditor: () => <div data-testid="mention-editor" />,
}));

const PROFILE_ID = 'profile-1';
const SHARE_TEXT = 'Découvrez ce profil';

const buildAxiosError = (status: number) =>
  new AxiosError('Request failed', String(status), undefined, undefined, {
    status,
    data: {},
    statusText: '',
    headers: {},
    config: {} as never,
  });

const renderModal = (onTriggerOAuth: jest.Mock, hasLinkedinLinked = true) =>
  renderWithProviders(
    <LinkedInSharePreviewModal
      profileId={PROFILE_ID}
      firstName="Marie"
      hasLinkedinLinked={hasLinkedinLinked}
      onTriggerOAuth={onTriggerOAuth}
    />
  );

describe('LinkedInSharePreviewModal', () => {
  beforeAll(() => {
    // jsdom does not implement Element.scrollTo, which Modal calls on open
    Element.prototype.scrollTo = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (Api.getProfileShareText as jest.Mock).mockResolvedValue({
      data: { text: SHARE_TEXT },
    });
  });

  it('restarts the LinkedIn OAuth flow and keeps the text when the share answers 401', async () => {
    const onTriggerOAuth = jest.fn().mockResolvedValue(undefined);
    (Api.postLinkedinShare as jest.Mock).mockRejectedValue(
      buildAxiosError(401)
    );

    renderModal(onTriggerOAuth);

    const confirmButton = await screen.findByTestId('linkedin-share-confirm');
    await waitFor(() => expect(confirmButton).not.toBeDisabled());
    fireEvent.click(confirmButton);

    await waitFor(() => expect(onTriggerOAuth).toHaveBeenCalledTimes(1));
    expect(localStorage.getItem(`pendingLinkedinText_${PROFILE_ID}`)).toBe(
      SHARE_TEXT
    );
  });

  it('shows an error without restarting OAuth when the share fails for another reason', async () => {
    const onTriggerOAuth = jest.fn().mockResolvedValue(undefined);
    (Api.postLinkedinShare as jest.Mock).mockRejectedValue(
      buildAxiosError(400)
    );

    renderModal(onTriggerOAuth);

    const confirmButton = await screen.findByTestId('linkedin-share-confirm');
    await waitFor(() => expect(confirmButton).not.toBeDisabled());
    fireEvent.click(confirmButton);

    expect(
      await screen.findByText(
        'Erreur lors du partage LinkedIn. Veuillez réessayer.'
      )
    ).toBeInTheDocument();
    expect(onTriggerOAuth).not.toHaveBeenCalled();
  });

  it('starts the OAuth flow without calling the share endpoint when the account is not linked', async () => {
    const onTriggerOAuth = jest.fn().mockResolvedValue(undefined);

    renderModal(onTriggerOAuth, false);

    const confirmButton = await screen.findByTestId('linkedin-share-confirm');
    await waitFor(() => expect(confirmButton).not.toBeDisabled());
    fireEvent.click(confirmButton);

    await waitFor(() => expect(onTriggerOAuth).toHaveBeenCalledTimes(1));
    expect(Api.postLinkedinShare).not.toHaveBeenCalled();
  });
});
