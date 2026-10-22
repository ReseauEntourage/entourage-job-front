import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { openModal } from '@/src/features/modals/Modal';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { useCurrentUserProfileComplete } from '@/src/hooks/current-user/useCurrentUserProfileComplete';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { AlertIA } from './AlertAI';

let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn(),
}));
jest.mock('@/src/hooks/current-user/useCurrentUserProfileComplete', () => ({
  useCurrentUserProfileComplete: jest.fn(),
}));
jest.mock('./GenerateProfileConfirmModal', () => ({
  GenerateProfileConfirmModal: () => null,
}));

const setup = (profile: unknown, profileComplete: unknown = null) => {
  (useCurrentUserProfile as jest.Mock).mockReturnValue(profile);
  (useCurrentUserProfileComplete as jest.Mock).mockReturnValue(profileComplete);
  const store = createTestStore();
  const dispatchSpy = jest.spyOn(store, 'dispatch');
  return { dispatchSpy, ...renderWithProviders(<AlertIA />, { store }) };
};

describe('AlertIA', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDesktop = true;
  });

  it('proposes to upload a CV when the user has none', () => {
    setup({ hasExternalCv: false });
    expect(
      screen.getByText(
        'Téléchargez votre CV pour remplir votre profil automatiquement'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Télécharger mon CV')).toBeInTheDocument();
  });

  it('shortens the labels on mobile', () => {
    mockDesktop = false;
    setup({ hasExternalCv: false });
    expect(screen.getByText('Télécharger')).toBeInTheDocument();
  });

  it('opens a PDF picker from the alert and uploads the chosen file', () => {
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    const clickSpy = jest
      .spyOn(HTMLInputElement.prototype, 'click')
      .mockImplementation(() => {});
    const { dispatchSpy } = setup({ hasExternalCv: false });
    fireEvent.click(screen.getByText('Nouvelle fonctionnalité IA'));
    const input = appendSpy.mock.calls
      .map(([node]) => node)
      .find((node) => node instanceof HTMLInputElement) as HTMLInputElement;
    expect(input.type).toBe('file');
    expect(input.accept).toBe('.pdf');
    expect(clickSpy).toHaveBeenCalledTimes(1);

    const file = new File(['pdf'], 'cv.pdf', { type: 'application/pdf' });
    input.onchange?.({ target: { files: [file] } } as any);
    const action = dispatchSpy.mock.calls
      .map(([a]: any) => a)
      .find(
        (a: any) => a.type === currentUserActions.uploadExternalCvRequested.type
      );
    expect(action.payload.formData.get('file')).toBe(file);
  });

  it('ignores a file that is not a PDF, or no file at all', () => {
    const appendSpy = jest.spyOn(document.body, 'appendChild');
    jest
      .spyOn(HTMLInputElement.prototype, 'click')
      .mockImplementation(() => {});
    const { dispatchSpy } = setup({ hasExternalCv: false });
    fireEvent.click(screen.getByText('Nouvelle fonctionnalité IA'));
    const input = appendSpy.mock.calls
      .map(([node]) => node)
      .filter((node) => node instanceof HTMLInputElement)
      .pop() as HTMLInputElement;
    input.onchange?.({
      target: { files: [new File(['x'], 'cv.png', { type: 'image/png' })] },
    } as any);
    input.onchange?.({ target: { files: [] } } as any);
    expect(
      dispatchSpy.mock.calls.some(
        ([a]: any) =>
          a.type === currentUserActions.uploadExternalCvRequested.type
      )
    ).toBe(false);
  });

  it('proposes to generate the profile once a CV is uploaded, without opening anything yet', () => {
    setup({ hasExternalCv: true }, { hasExtractedCvData: false });
    expect(screen.getByText('Générer mon profil')).toBeInTheDocument();
    expect(openModal).not.toHaveBeenCalled();
  });

  it('opens the generation modal when clicking the alert itself', () => {
    setup({ hasExternalCv: true }, null);
    fireEvent.click(screen.getByText('Nouvelle fonctionnalité IA'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('shows nothing once the profile was generated from the CV', () => {
    const { container } = setup(
      { hasExternalCv: true },
      { hasExtractedCvData: true }
    );
    expect(container).toBeEmptyDOMElement();
  });
});
