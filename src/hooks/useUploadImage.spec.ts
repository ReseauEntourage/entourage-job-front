import { renderHook } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import Resizer from 'react-image-file-resizer';
import { notificationsActions } from '@/src/use-cases/notifications';
import { useUploadImage } from './useUploadImage';

jest.mock('react-image-file-resizer', () => ({
  __esModule: true,
  default: { imageFileResizer: jest.fn() },
}));
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

const mockResize = Resizer.imageFileResizer as jest.Mock;

describe('useUploadImage', () => {
  const resized = new Blob(['resized']);

  beforeEach(() => {
    jest.clearAllMocks();
    mockResize.mockImplementation((...args) => args[6](resized));
    Object.assign(URL, {
      createObjectURL: jest.fn().mockReturnValue('blob:img'),
    });
  });

  it('resizes an image to JPEG and returns it with an object url', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const { result } = renderHook(() => useUploadImage());

    await expect(result.current(file)).resolves.toEqual({
      profileImage: resized,
      profileImageObjectUrl: 'blob:img',
    });
    expect(mockResize).toHaveBeenCalledWith(
      file,
      2000,
      1500,
      'JPEG',
      75,
      0,
      expect.any(Function),
      'blob'
    );
    expect(URL.createObjectURL).toHaveBeenCalledWith(resized);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('warns when the file is not an image', async () => {
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' });
    const { result } = renderHook(() => useUploadImage());
    await result.current(file);

    expect(mockDispatch).toHaveBeenCalledWith(
      notificationsActions.addNotification({
        type: 'danger',
        variant: 'toast',
        message: 'Le fichier doit être une image',
      })
    );
  });

  it('returns null without a file', async () => {
    const { result } = renderHook(() => useUploadImage());
    await expect(result.current(null as unknown as File)).resolves.toBeNull();
    expect(mockResize).not.toHaveBeenCalled();
  });
});
