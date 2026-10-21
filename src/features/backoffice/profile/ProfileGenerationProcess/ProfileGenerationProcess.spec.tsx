import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React, { createRef } from 'react';
import { useProfileGeneration } from '@/src/hooks';
import {
  ProfileGenerationProcess,
  ProfileGenerationProcessHandle,
} from './ProfileGenerationProcess';

jest.mock('@/src/hooks', () => ({ useProfileGeneration: jest.fn() }));
jest.mock('@/src/features/profile/ai/OpenAILegalMention', () => ({
  OpenAILegalMention: () => <div data-testid="legal" />,
}));
jest.mock(
  '@/src/features/profile/ai/ProfileGenerationLoadingIndicator',
  () => ({
    ProfileGenerationLoadingIndicator: () => <div data-testid="loading" />,
  })
);

describe('ProfileGenerationProcess', () => {
  const generateProfileFromCV = jest.fn();
  let hookOptions: any;

  const mockHook = (isLoading = false) => {
    (useProfileGeneration as jest.Mock).mockImplementation((options) => {
      hookOptions = options;
      return { generateProfileFromCV, isLoading };
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockHook();
  });

  it('explains the feature and shows the legal mention', () => {
    render(<ProfileGenerationProcess title="Générer" />);

    expect(screen.getByText('Générer')).toBeInTheDocument();
    expect(
      screen.getByText(/récupérer les informations de votre CV/)
    ).toBeInTheDocument();
    expect(screen.getByTestId('legal')).toBeInTheDocument();
    expect(screen.queryByText(/seront écrasées/)).not.toBeInTheDocument();
  });

  it('warns that the existing profile will be overwritten when asked', () => {
    render(<ProfileGenerationProcess overwriteWarning />);

    expect(screen.getByText(/seront écrasées/)).toBeInTheDocument();
  });

  it('starts the generation from its own button', () => {
    render(<ProfileGenerationProcess />);
    fireEvent.click(
      screen.getByRole('button', { name: /Générer mon profil avec l'IA/ })
    );

    expect(generateProfileFromCV).toHaveBeenCalledTimes(1);
  });

  it('shows a loading indicator and disables the button while generating', () => {
    mockHook(true);
    render(<ProfileGenerationProcess />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Générer mon profil/ })
    ).toBeDisabled();
  });

  it('hides its own button when the parent drives the generation, and exposes it through a ref', () => {
    const ref = createRef<ProfileGenerationProcessHandle>();
    render(<ProfileGenerationProcess noAction ref={ref} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    ref.current?.generateProfileFromCV();
    expect(generateProfileFromCV).toHaveBeenCalledTimes(1);
  });

  it('notifies the parent of the loading state and of the end of the generation', () => {
    const onLoadingChange = jest.fn();
    const onProfileGenerated = jest.fn();
    render(
      <ProfileGenerationProcess
        onLoadingChange={onLoadingChange}
        onProfileGenerated={onProfileGenerated}
      />
    );

    expect(onLoadingChange).toHaveBeenCalledWith(false);
    hookOptions.onProfileGenerated();
    expect(onProfileGenerated).toHaveBeenCalledTimes(1);
  });

  it('tolerates a generation end without parent callback', () => {
    render(<ProfileGenerationProcess />);

    expect(() => hookOptions.onProfileGenerated()).not.toThrow();
  });
});
