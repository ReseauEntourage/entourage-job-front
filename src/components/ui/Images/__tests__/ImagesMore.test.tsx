import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { EventType } from '@/src/constants/events';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { ImgEvent } from '../ImgEvent/ImgEvent';
import { ImgCompanyProfile } from '../ImgProfile/ImgCompanyProfile/ImgCompanyProfile';
import { ImgUserProfile } from '../ImgProfile/ImgUserProfile/ImgUserProfile';
import { ImgProfileStack } from '../ImgProfileStack/ImgProfileStack';
import { LegacyImg } from '../LegacyImg';
import { Logo } from '../Logo';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));

describe('LegacyImg', () => {
  it('renders cover, sized and filled variants with their alt text', () => {
    const { rerender } = render(<LegacyImg src="/a.png" alt="cover" cover />);
    expect(screen.getByAltText('cover')).toHaveStyle({ objectFit: 'cover' });
    rerender(<LegacyImg src="/a.png" alt="sized" width={10} height={10} />);
    expect(screen.getByAltText('sized')).toHaveStyle({ objectFit: 'contain' });
    rerender(<LegacyImg src="/a.png" alt="fill" />);
    expect(screen.getByAltText('fill')).toBeInTheDocument();
  });
});

describe('Logo', () => {
  it('links to the partner and shows its logo, plus the alternate one', () => {
    render(<Logo logoKey="acme" link="https://acme.test" bis />);
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://acme.test'
    );
    expect(screen.getAllByAltText('acme')).toHaveLength(2);
  });

  it('shows only the main logo by default', () => {
    render(<Logo logoKey="acme" link="https://acme.test" />);
    expect(screen.getAllByAltText('acme')).toHaveLength(1);
  });
});

describe('ImgEvent', () => {
  it('shows the event picture, with a fallback for unknown types', () => {
    const { rerender } = render(
      <ImgEvent eventType={EventType.WELCOME_SESSION} alt="evt" />
    );
    expect(screen.getByAltText('evt')).toBeInTheDocument();
    rerender(<ImgEvent eventType={'OTHER' as never} alt="evt2" />);
    expect(screen.getByAltText('evt2')).toBeInTheDocument();
  });
});

describe('ImgProfileStack', () => {
  it('renders its children', () => {
    render(
      <ImgProfileStack>
        <span>a</span>
        <span>b</span>
      </ImgProfileStack>
    );
    expect(screen.getByText('a')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });
});

describe('ImgCompanyProfile', () => {
  it('shows an icon without logo', () => {
    renderWithProviders(
      <ImgCompanyProfile company={{ id: '1', name: 'Acme' }} size={30} />
    );
    expect(screen.getByLabelText('CompanyIcon Icon')).toBeInTheDocument();
  });

  it('shows the logo with its alt text', () => {
    renderWithProviders(
      <ImgCompanyProfile
        company={{ id: '1', name: 'Acme', logoUrl: '/logo.png' }}
      />
    );
    expect(screen.getByAltText('Logo de Acme')).toBeInTheDocument();
  });
});

describe('ImgUserProfile', () => {
  it('shows the initial without picture', () => {
    renderWithProviders(
      <ImgUserProfile
        user={{ id: 'u', firstName: 'Marie' }}
        hasPicture={false}
      />
    );
    expect(screen.getByText('M')).toBeInTheDocument();
  });

  it('shows the picture when there is one', () => {
    renderWithProviders(
      <ImgUserProfile user={{ id: 'u', firstName: 'Marie' }} hasPicture />
    );
    expect(screen.getByAltText('photo de Marie')).toBeInTheDocument();
  });
});
