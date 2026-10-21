jest.mock('@/src/api');
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: jest.fn(),
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));

import { cleanup, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { useIsMobile } from '@/src/hooks/utils';
import { gaEvent } from '@/src/lib/gtag';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { getMockedApi } from '@/src/store/testUtils/mockApi';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { messagingActions, messagingApi } from '@/src/use-cases/messaging';
import { MessagingEditor } from './MessagingEditor';

const mockedApi = getMockedApi();

async function setup({
  readonly,
  message = '',
}: { readonly?: boolean; message?: string } = {}) {
  const store = createTestStore();
  store.dispatch(messagingActions.selectConversation('conv1'));
  store.dispatch(messagingActions.setNewMessage(message));
  await store.dispatch(
    messagingApi.util.upsertQueryData('getSelectedConversation', 'conv1', {
      id: 'conv1',
      type: 'direct',
      messages: [],
      participants: [],
    } as any) as any
  );
  return {
    ...renderWithProviders(<MessagingEditor readonly={readonly} />, { store }),
    store,
  };
}

const file = (name: string) =>
  new File(['content'], name, { type: 'application/pdf' });

const addFiles = (...files: File[]) =>
  fireEvent.change(screen.getByTestId('file-input'), {
    target: { files },
  });

describe('MessagingEditor interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useIsMobile as jest.Mock).mockReturnValue(false);
  });
  afterEach(() => cleanup());

  it('stores what the user types as the draft message', async () => {
    const { store } = await setup();
    fireEvent.change(screen.getByTestId('messaging-editor-input'), {
      target: { value: 'Salut' },
    });
    expect(store.getState().messaging.newMessage).toBe('Salut');
    expect(screen.getByTestId('messaging-editor-input')).toHaveValue('Salut');
  });

  it('locks the input and the send button when readonly', async () => {
    await setup({ readonly: true });
    expect(screen.getByTestId('messaging-editor-input')).toBeDisabled();
    expect(screen.getByTestId('messaging-send-button')).toBeDisabled();
  });

  it('shows a text send button on desktop and an icon button on mobile', async () => {
    await setup();
    expect(screen.getByText('Envoyer')).toBeInTheDocument();
    cleanup();
    (useIsMobile as jest.Mock).mockReturnValue(true);
    await setup();
    expect(screen.queryByText('Envoyer')).toBeNull();
    expect(screen.getByTestId('messaging-send-button')).toBeInTheDocument();
  });

  it('opens the file picker from the attach button', async () => {
    await setup();
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    const click = jest.spyOn(input, 'click');
    fireEvent.click(screen.getByTestId('messaging-attach-button'));
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('lists the attachments and lets the user remove one', async () => {
    await setup();
    addFiles(file('cv.pdf'), file('lettre.pdf'));
    expect(screen.getByText('cv.pdf')).toBeInTheDocument();
    expect(screen.getByText('lettre.pdf')).toBeInTheDocument();

    const chip = screen.getByText('cv.pdf').parentElement as HTMLElement;
    fireEvent.click(chip.querySelector('button') as HTMLElement);
    expect(screen.queryByText('cv.pdf')).toBeNull();
    expect(screen.getByText('lettre.pdf')).toBeInTheDocument();
  });

  it('sends the message with its attachments, tracks it, then resets the editor', async () => {
    mockedApi.postMessage.mockResolvedValue({ data: {} } as any);
    const { store } = await setup({ message: 'Voici mon CV' });
    addFiles(file('cv.pdf'));
    fireEvent.click(screen.getByTestId('messaging-send-button'));

    expect(mockedApi.postMessage).toHaveBeenCalledTimes(1);
    const formData = mockedApi.postMessage.mock.calls[0][0] as FormData;
    expect(formData.get('content')).toBe('Voici mon CV');
    expect(formData.get('conversationId')).toBe('conv1');
    expect((formData.getAll('files')[0] as File).name).toBe('cv.pdf');
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.BACKOFFICE_MESSAGING_MESSAGE_SEND
    );
    expect(store.getState().messaging.newMessage).toBe('');
    expect(screen.queryByText('cv.pdf')).toBeNull();
  });

  it('ignores an empty file selection', async () => {
    await setup();
    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [] },
    });
    expect(screen.queryByText('cv.pdf')).toBeNull();
  });
});
