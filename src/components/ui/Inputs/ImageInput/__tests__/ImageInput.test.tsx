import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { ImageInput } from '../ImageInput';

const mockUploadImage = jest.fn();
jest.mock('@/src/hooks/useUploadImage', () => ({
  useUploadImage: () => mockUploadImage,
}));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('ImageInput', () => {
  beforeEach(() => jest.clearAllMocks());

  const selectFile = () =>
    fireEvent.change(screen.getByTestId('avatar'), {
      target: { files: [new File(['x'], 'a.png', { type: 'image/png' })] },
    });

  it('accepts only images and renders children as activator', () => {
    render(
      <ImageInput id="avatar" name="avatar" onChange={jest.fn()}>
        <span>Changer la photo</span>
      </ImageInput>
    );
    expect(screen.getByText('Changer la photo')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toHaveAttribute('accept', 'image/*');
  });

  it('reports the processed image', async () => {
    const image = { profileImage: new Blob(), profileImageObjectUrl: 'blob:1' };
    mockUploadImage.mockResolvedValue(image);
    const onChange = jest.fn();
    render(<ImageInput id="avatar" name="avatar" onChange={onChange} />);
    selectFile();
    await waitFor(() => expect(onChange).toHaveBeenCalledWith(image));
  });

  it('ignores a file that could not be processed', async () => {
    mockUploadImage.mockResolvedValue(null);
    const onChange = jest.fn();
    render(<ImageInput id="avatar" name="avatar" onChange={onChange} />);
    selectFile();
    await waitFor(() => expect(mockUploadImage).toHaveBeenCalled());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(
      <ImageInput id="avatar" name="avatar" onChange={jest.fn()} hidden />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
