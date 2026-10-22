import '@testing-library/jest-dom';
import { fireEvent, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Api } from '@/src/api';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { selectNotifications } from '@/src/use-cases/notifications';
import { NewsletterPartial } from './NewsletterPartial';

jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));

const tag = GA_TAGS.PAGE_CV_INSCRIPTION_NEWSLETTER_CLIC;

const fillEmail = (value: string) =>
  fireEvent.change(screen.getByTestId('nl-email-input'), { target: { value } });

describe('NewsletterPartial', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('refuses an invalid email without calling the API', () => {
    renderWithProviders(<NewsletterPartial tag={tag} />);
    fillEmail('not-an-email');
    fireEvent.click(screen.getByTestId('nl-submit-btn'));

    expect(screen.getByTestId('nl-error-msg')).toHaveTextContent(
      'Adresse mail invalide.'
    );
    expect(Api.postNewsletter).not.toHaveBeenCalled();
    expect(gaEvent).not.toHaveBeenCalled();
  });

  it('subscribes with the chosen status and zone, tracks it, notifies and clears the form', async () => {
    (Api.postNewsletter as jest.Mock).mockResolvedValue({});
    const { store } = renderWithProviders(<NewsletterPartial tag={tag} />);
    fireEvent.click(screen.getByLabelText('une entreprise'));
    fireEvent.click(screen.getByLabelText('Région lyonnaise'));
    fillEmail('jane@acme.fr');
    fireEvent.click(screen.getByTestId('nl-submit-btn'));

    await waitFor(() =>
      expect(selectNotifications(store.getState())).toEqual([
        expect.objectContaining({
          type: 'success',
          message:
            'Votre inscription à la newsletter a bien été prise en compte !',
        }),
      ])
    );
    expect(Api.postNewsletter).toHaveBeenCalledWith({
      email: 'jane@acme.fr',
      zone: expect.any(String),
      status: 'ENTREPRISE',
    });
    expect(gaEvent).toHaveBeenCalledWith(tag);
    expect(screen.getByTestId('nl-email-input')).toHaveValue('');
    expect(screen.getByLabelText('une entreprise')).not.toBeChecked();
    expect(screen.getByLabelText('Région lyonnaise')).not.toBeChecked();
  });

  it('lets the user unselect a status or a zone by clicking it again', async () => {
    (Api.postNewsletter as jest.Mock).mockResolvedValue({});
    renderWithProviders(<NewsletterPartial tag={tag} />);
    fireEvent.click(screen.getByLabelText('un particulier'));
    fireEvent.click(screen.getByLabelText('un particulier'));
    fireEvent.click(screen.getByLabelText('Autre'));
    fireEvent.click(screen.getByLabelText('Autre'));
    fillEmail('jane@acme.fr');
    fireEvent.click(screen.getByTestId('nl-submit-btn'));

    await waitFor(() => expect(Api.postNewsletter).toHaveBeenCalledTimes(1));
    expect(Api.postNewsletter).toHaveBeenCalledWith({
      email: 'jane@acme.fr',
      zone: null,
      status: null,
    });
  });

  it('notifies an error and keeps the email when the subscription fails', async () => {
    (Api.postNewsletter as jest.Mock).mockRejectedValue(new Error('x'));
    const { store } = renderWithProviders(<NewsletterPartial tag={tag} />);
    fillEmail('jane@acme.fr');
    fireEvent.click(screen.getByTestId('nl-submit-btn'));

    await waitFor(() =>
      expect(selectNotifications(store.getState())).toEqual([
        expect.objectContaining({
          type: 'danger',
          message: "Une erreur s'est produite",
        }),
      ])
    );
    expect(screen.getByTestId('nl-email-input')).toHaveValue('jane@acme.fr');
  });
});
