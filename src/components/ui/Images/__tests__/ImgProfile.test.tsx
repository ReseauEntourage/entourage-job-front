import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Image } from '../Image';
import { ImgProfile } from '../ImgProfile/ImgProfile';

describe('ImgProfile', () => {
  it('shows the first letter of the placeholder without picture', () => {
    render(<ImgProfile pictureUrl={null} placeholder="Marie" />);
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows the picture with its alt text', () => {
    render(
      <ImgProfile
        pictureUrl="/a.png"
        placeholder="Marie"
        alt="Photo de Marie"
      />
    );
    expect(screen.getByAltText('Photo de Marie')).toBeInTheDocument();
    expect(screen.queryByText('M')).not.toBeInTheDocument();
  });
});

describe('Image', () => {
  it('renders an image with alt text', () => {
    render(<Image src="/a.png" alt="Logo" width={10} height={10} />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('renders a cover image filling its container', () => {
    render(<Image src="/a.png" alt="Fond" cover objectPosition="top" />);
    expect(screen.getByAltText('Fond')).toHaveStyle({ objectFit: 'cover' });
  });
});
