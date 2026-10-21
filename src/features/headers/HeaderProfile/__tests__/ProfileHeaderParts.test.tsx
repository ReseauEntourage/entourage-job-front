import '@testing-library/jest-dom';
import { act, renderHook } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Provider } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { currentUserActions } from '@/src/use-cases/current-user';
import { ProfileCompletion } from '../ProfileCompletion/ProfileCompletion';
import { ProfileContactInfos } from '../ProfileContactInfos/ProfileContactInfos';
import { useUploadProfileImage } from '../useUploadProfileImage';

const mockCompletion = jest.fn();
const mockStep = jest.fn();
jest.mock('@/src/use-cases/profile-completion', () => ({
  ...jest.requireActual('@/src/use-cases/profile-completion'),
  useGetProfileCompletionQuery: (...args: unknown[]) => mockCompletion(...args),
}));
jest.mock('@/src/use-cases/onboardingOld', () => ({
  ...jest.requireActual('@/src/use-cases/onboardingOld'),
  selectOnboardingCurrentStep: () => mockStep(),
}));
const mockPictureStatus = jest.fn();
jest.mock('@/src/use-cases/current-user', () => {
  const actual = jest.requireActual('@/src/use-cases/current-user');
  return {
    ...actual,
    updateUserProfilePictureSelectors: {
      ...actual.updateUserProfilePictureSelectors,
      // A new selector per access, so that useSelector re-runs it on re-render
      get selectUpdateUserProfilePictureStatus() {
        return () => mockPictureStatus();
      },
    },
  };
});
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('ProfileContactInfos', () => {
  it('renders nothing without phone nor email', () => {
    const { container } = render(<ProfileContactInfos />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the privacy notice with the provided contact details', () => {
    render(<ProfileContactInfos phone="0612345678" email="a@b.fr" />);
    expect(
      screen.getByText(/visibles uniquement par vous/)
    ).toBeInTheDocument();
    expect(screen.getByText('0612345678')).toBeInTheDocument();
    expect(screen.getByText('a@b.fr')).toBeInTheDocument();
  });

  it('shows only the available detail', () => {
    render(<ProfileContactInfos email="a@b.fr" />);
    expect(screen.getByText('a@b.fr')).toBeInTheDocument();
    expect(screen.queryByText('0612345678')).not.toBeInTheDocument();
  });
});

describe('ProfileCompletion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPictureStatus.mockReturnValue('IDLE');
  });

  it('shows the completion rate', () => {
    mockStep.mockReturnValue(0);
    mockCompletion.mockReturnValue({ data: 65 });
    renderWithProviders(<ProfileCompletion />);
    expect(screen.getByText('Complétion du profil')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(mockCompletion).toHaveBeenCalledWith(undefined, { skip: false });
  });

  it('defaults to 0% and skips the query while onboarding is in progress', () => {
    mockStep.mockReturnValue(2);
    mockCompletion.mockReturnValue({ data: undefined });
    renderWithProviders(<ProfileCompletion />);
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(mockCompletion).toHaveBeenCalledWith(undefined, { skip: true });
  });
});

describe('useUploadProfileImage', () => {
  it('dispatches the upload request and flags the upload as running', async () => {
    const store = createTestStore();
    const dispatch = jest.spyOn(store, 'dispatch');
    const { result } = renderHook(() => useUploadProfileImage(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    expect(result.current.imageUploading).toBe(false);

    const profileImage = new Blob(['x']);
    await act(async () => {
      await result.current.uploadProfileImage({ profileImage });
    });
    expect(dispatch).toHaveBeenCalledWith(
      currentUserActions.updateUserProfilePictureRequested({ profileImage })
    );
    expect(result.current.imageUploading).toBe(true);
  });

  it('stops the loading flag once the picture update succeeded', async () => {
    mockPictureStatus.mockReturnValue('IDLE');
    const store = createTestStore();
    const { result, rerender } = renderHook(() => useUploadProfileImage(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });
    await act(async () => {
      await result.current.uploadProfileImage({
        profileImage: new Blob(['x']),
      });
    });
    expect(result.current.imageUploading).toBe(true);

    mockPictureStatus.mockReturnValue(ReduxRequestEvents.SUCCEEDED);
    rerender();
    expect(result.current.imageUploading).toBe(false);
  });
});
