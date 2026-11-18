jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsMobile: jest.fn(),
}));
jest.mock(
  '@/src/components/ui/Images/ImgProfile/ImgUserProfile/ImgUserProfile',
  () => ({
    ImgUserProfile: ({ user, hasPicture }: any) => (
      <div data-testid="user-picture">
        {user.firstName}|{String(hasPicture)}
      </div>
    ),
  })
);
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { useIsMobile } from '@/src/hooks/utils';
import { StepPhotoContent } from './StepPhotoContent';

const user = { id: 'u1', firstName: 'Awa', role: UserRoles.CANDIDATE };
const originalMediaDevices = Object.getOwnPropertyDescriptor(
  navigator,
  'mediaDevices'
);

const setCameras = (value: unknown) =>
  Object.defineProperty(navigator, 'mediaDevices', {
    value,
    configurable: true,
  });

describe('StepPhotoContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useIsMobile as jest.Mock).mockReturnValue(false);
    (URL as any).createObjectURL = jest.fn(() => 'blob:photo');
  });
  afterEach(() => {
    cleanup();
    if (originalMediaDevices) {
      Object.defineProperty(navigator, 'mediaDevices', originalMediaDevices);
    } else {
      delete (navigator as any).mediaDevices;
    }
  });

  it('shows a placeholder icon when there is no photo', () => {
    render(
      <StepPhotoContent photoObjectUrl={null} onPhotoSelected={jest.fn()} />
    );
    expect(screen.queryByAltText('Photo de profil')).toBeNull();
    expect(screen.queryByTestId('user-picture')).toBeNull();
    expect(screen.getByText('Format JPG, PNG. Max 5 Mo.')).toBeInTheDocument();
  });

  it('previews the photo just selected', () => {
    render(
      <StepPhotoContent photoObjectUrl="blob:x" onPhotoSelected={jest.fn()} />
    );
    expect(screen.getByAltText('Photo de profil')).toHaveAttribute(
      'src',
      'blob:x'
    );
  });

  it('shows the existing picture of the user when there is one', () => {
    render(
      <StepPhotoContent
        photoObjectUrl={null}
        onPhotoSelected={jest.fn()}
        existingUser={user}
        hasPicture
      />
    );
    expect(screen.getByTestId('user-picture')).toHaveTextContent('Awa|true');
  });

  it('does not show the existing picture when the user has none', () => {
    render(
      <StepPhotoContent
        photoObjectUrl={null}
        onPhotoSelected={jest.fn()}
        existingUser={user}
      />
    );
    expect(screen.queryByTestId('user-picture')).toBeNull();
  });

  it('reports the imported photo and resets the input', () => {
    const onPhotoSelected = jest.fn();
    const { container } = render(
      <StepPhotoContent
        photoObjectUrl={null}
        onPhotoSelected={onPhotoSelected}
      />
    );
    const photo = new File(['p'], 'me.png', { type: 'image/png' });
    const inputs = container.querySelectorAll('input[type="file"]');
    const gallery = inputs[1] as HTMLInputElement;
    const click = jest.spyOn(gallery, 'click');
    fireEvent.click(screen.getByText('Importer une photo'));
    expect(click).toHaveBeenCalledTimes(1);

    fireEvent.change(gallery, { target: { files: [photo] } });
    expect(onPhotoSelected).toHaveBeenCalledWith(photo, 'blob:photo');
    expect(gallery.value).toBe('');
  });

  it('ignores an empty file selection', () => {
    const onPhotoSelected = jest.fn();
    const { container } = render(
      <StepPhotoContent
        photoObjectUrl={null}
        onPhotoSelected={onPhotoSelected}
      />
    );
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [] },
    });
    expect(onPhotoSelected).not.toHaveBeenCalled();
  });

  describe('visibility hint', () => {
    const HINT =
      "Les profils avec une photo ont 2 fois plus de chances d'être contactés par des coachs.";

    it('shows the hint under the photo buttons while no photo is selected', () => {
      render(
        <StepPhotoContent
          photoObjectUrl={null}
          onPhotoSelected={jest.fn()}
          visibilityHint={HINT}
        />
      );
      const hint = screen.getByTestId('photo-visibility-hint');
      expect(hint).toHaveTextContent(HINT);
      // Placed after the format mention, which stays next to the buttons
      expect(
        screen
          .getByText('Format JPG, PNG. Max 5 Mo.')
          .compareDocumentPosition(hint) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });

    it('does not show anything without hint text', () => {
      render(
        <StepPhotoContent photoObjectUrl={null} onPhotoSelected={jest.fn()} />
      );
      expect(screen.queryByTestId('photo-visibility-hint')).toBeNull();
    });

    it('hides the hint once a photo is selected', () => {
      render(
        <StepPhotoContent
          photoObjectUrl="blob:x"
          onPhotoSelected={jest.fn()}
          visibilityHint={HINT}
        />
      );
      expect(screen.queryByTestId('photo-visibility-hint')).toBeNull();
    });

    (
      [
        ['import', 1],
        ['camera', 0],
      ] as const
    ).forEach(([source, inputIndex]) => {
      it(`hides the hint after a photo chosen by ${source}`, () => {
        const Harness = () => {
          const [url, setUrl] = React.useState<string | null>(null);
          return (
            <StepPhotoContent
              photoObjectUrl={url}
              onPhotoSelected={(_blob, objectUrl) => setUrl(objectUrl)}
              visibilityHint={HINT}
            />
          );
        };
        const { container } = render(<Harness />);
        expect(screen.getByTestId('photo-visibility-hint')).toBeInTheDocument();

        const photo = new File(['p'], 'me.png', { type: 'image/png' });
        const input = container.querySelectorAll('input[type="file"]')[
          inputIndex
        ] as HTMLInputElement;
        fireEvent.change(input, { target: { files: [photo] } });

        expect(screen.queryByTestId('photo-visibility-hint')).toBeNull();
        expect(screen.getByAltText('Photo de profil')).toBeInTheDocument();
      });
    });
  });

  it('offers to take a picture on mobile when a camera exists', async () => {
    (useIsMobile as jest.Mock).mockReturnValue(true);
    setCameras({
      enumerateDevices: jest.fn().mockResolvedValue([{ kind: 'videoinput' }]),
    });
    const { container } = render(
      <StepPhotoContent photoObjectUrl={null} onPhotoSelected={jest.fn()} />
    );
    const button = await screen.findByText('Se prendre en photo');
    const camera = container.querySelector(
      'input[capture]'
    ) as HTMLInputElement;
    const click = jest.spyOn(camera, 'click');
    fireEvent.click(button);
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('does not offer the camera without video device, on desktop, or when enumeration fails', async () => {
    (useIsMobile as jest.Mock).mockReturnValue(true);
    setCameras({
      enumerateDevices: jest.fn().mockResolvedValue([{ kind: 'audioinput' }]),
    });
    render(
      <StepPhotoContent photoObjectUrl={null} onPhotoSelected={jest.fn()} />
    );
    await act(async () => {});
    expect(screen.queryByText('Se prendre en photo')).toBeNull();
    cleanup();

    setCameras({
      enumerateDevices: jest.fn().mockRejectedValue(new Error('no')),
    });
    render(
      <StepPhotoContent photoObjectUrl={null} onPhotoSelected={jest.fn()} />
    );
    await act(async () => {});
    expect(screen.queryByText('Se prendre en photo')).toBeNull();
    cleanup();

    (useIsMobile as jest.Mock).mockReturnValue(false);
    const enumerateDevices = jest.fn();
    setCameras({ enumerateDevices });
    render(
      <StepPhotoContent photoObjectUrl={null} onPhotoSelected={jest.fn()} />
    );
    expect(enumerateDevices).not.toHaveBeenCalled();
  });
});
