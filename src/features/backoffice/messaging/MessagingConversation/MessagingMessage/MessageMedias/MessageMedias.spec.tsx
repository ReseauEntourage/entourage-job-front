jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Media } from '@/src/api/types';
import { MessageMedia } from './MessageMedia/MessageMedia';
import { MessageMedias } from './MessageMedias';

const media = (overrides: Partial<Media> = {}): Media => ({
  id: 'm1',
  name: 'photo.png',
  s3Key: 'k',
  mimeType: 'image/png',
  size: 10,
  userId: 'u1',
  signedUrl: 'https://cdn.test/photo.png',
  ...overrides,
});

describe('MessageMedia', () => {
  const open = jest.fn();
  const originalOpen = window.open;

  beforeEach(() => {
    window.open = open;
    open.mockClear();
  });
  afterEach(() => {
    window.open = originalOpen;
    cleanup();
  });

  it('previews a single image and opens it in a new tab on click', () => {
    render(<MessageMedia media={media()} />);
    const img = screen.getByAltText('photo.png');
    expect(img).toBeInTheDocument();
    fireEvent.click(img);
    expect(open).toHaveBeenCalledWith('https://cdn.test/photo.png', '_blank');
  });

  it('shows the file name for multiple mode', () => {
    render(<MessageMedia media={media()} mode="multiple" />);
    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  it('truncates long file names but keeps the extension', () => {
    render(
      <MessageMedia
        media={media({
          name: 'a-very-long-document-name-here.pdf',
          mimeType: 'application/pdf',
        })}
        mode="multiple"
      />
    );
    expect(screen.getByText('a-very-long-document....pdf')).toBeInTheDocument();
  });

  it('does not open anything while the signed url is not available', () => {
    render(<MessageMedia media={media({ signedUrl: '' })} mode="multiple" />);
    fireEvent.click(screen.getByText('photo.png'));
    expect(open).not.toHaveBeenCalled();
  });
});

describe('MessageMedias', () => {
  afterEach(() => cleanup());

  it('renders nothing without medias', () => {
    const { container } = render(<MessageMedias />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a single image as a preview', () => {
    render(<MessageMedias medias={[media()]} />);
    expect(screen.getByAltText('photo.png')).toBeInTheDocument();
  });

  it('renders a grid of file names for several medias or non image files', () => {
    render(
      <MessageMedias
        medias={[
          media({ id: 'a', name: 'one.png' }),
          media({ id: 'b', name: 'two.pdf', mimeType: 'application/pdf' }),
        ]}
      />
    );
    expect(screen.getByText('one.png')).toBeInTheDocument();
    expect(screen.getByText('two.pdf')).toBeInTheDocument();
    expect(screen.queryByAltText('one.png')).toBeNull();
    cleanup();
    render(
      <MessageMedias
        medias={[media({ name: 'cv.pdf', mimeType: 'application/pdf' })]}
      />
    );
    expect(screen.getByText('cv.pdf')).toBeInTheDocument();
  });
});
