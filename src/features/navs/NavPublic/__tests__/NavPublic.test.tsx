import { fireEvent, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { GA_TAGS } from '@/src/constants/tags';
import { useIsDesktop } from '@/src/hooks/utils';
import { gaEvent } from '@/src/lib/gtag';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { NavPublic } from '../NavPublic';
import { NavPublicDesktop } from '../NavPublic.desktop';
import { NavPublicMobile } from '../NavPublic.mobile';
import { LINKS } from '../NavPublic.utils';
import { NavPublicItem } from '../NavPublicItem/NavPublicItem';
import { NavPublicItemDesktop } from '../NavPublicItem/NavPublicItem.desktop';
import { NavPublicItemMobile } from '../NavPublicItem/NavPublicItem.mobile';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsDesktop: jest.fn(),
}));

const push = jest.fn();

const mockRouter = (asPath = '/') => {
  (useRouter as jest.Mock).mockReturnValue({ asPath, push });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockRouter();
  (useIsDesktop as jest.Mock).mockReturnValue(true);
});

describe('LINKS', () => {
  it('declares a tracking tag for every entry and child', () => {
    LINKS.forEach((link) => {
      expect(link.tag).toBeDefined();
      link.childrens?.forEach((child) => {
        expect(child.tag).toBeDefined();
        expect(child.href).toBeDefined();
      });
    });
  });
});

describe('NavPublic', () => {
  it('renders the desktop navigation on desktop', () => {
    renderWithProviders(<NavPublic />);
    expect(screen.getByText('Devenir coach')).toBeInTheDocument();
    expect(screen.queryByText('Accueil')).toBeNull();
  });

  it('renders the collapsed mobile navigation on mobile', () => {
    (useIsDesktop as jest.Mock).mockReturnValue(false);
    renderWithProviders(<NavPublic />);
    expect(screen.queryByText('Devenir coach')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('delegates NavPublicItem to the right platform', () => {
    const item = {
      href: '/aider',
      name: 'Devenir coach',
      tag: GA_TAGS.HEADER_AIDER_CLIC,
    };
    const { unmount } = renderWithProviders(<NavPublicItem item={item} />);
    expect(
      screen.getByRole('link', { name: 'Devenir coach' })
    ).toBeInTheDocument();
    unmount();
    (useIsDesktop as jest.Mock).mockReturnValue(false);
    renderWithProviders(<NavPublicItem item={item} />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });
});

describe('NavPublicDesktop', () => {
  it('shows every top-level entry, the auth actions and the home logo link', () => {
    renderWithProviders(<NavPublicDesktop />);
    LINKS.forEach((link) => {
      expect(screen.getByText(link.name)).toBeInTheDocument();
    });
    expect(screen.getByRole('link', { name: 'Connexion' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Inscription' })
    ).toBeInTheDocument();
  });

  it('tracks a click on a simple entry', () => {
    renderWithProviders(<NavPublicDesktop />);
    fireEvent.click(screen.getByText('Devenir coach'));
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HEADER_AIDER_CLIC);
  });

  it('opens the dropdown of a group and navigates to a child', () => {
    renderWithProviders(<NavPublicDesktop />);
    expect(screen.queryByText('Recruter inclusif')).toBeNull();
    fireEvent.click(screen.getByText('Engager son entreprise'));
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HEADER_RECRUTER_CLIC);
    fireEvent.click(screen.getByText('Recruter inclusif'));
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HEADER_RECRUTER_INCLUSIF_CLIC);
    expect(push).toHaveBeenCalledWith('/entreprises/recruter-inclusif');
  });
});

describe('NavPublicItemDesktop', () => {
  it('marks a group as selected when one of its children is the current page', () => {
    mockRouter('/entreprises/s-engager');
    renderWithProviders(<NavPublicItemDesktop item={LINKS[3]} />);
    const label = screen.getByText('Engager son entreprise');
    expect(getComputedStyle(label).backgroundColor).toBe('rgb(71, 168, 185)');
  });

  it('renders a group without href as plain text, not a link', () => {
    renderWithProviders(<NavPublicItemDesktop item={LINKS[3]} />);
    expect(
      screen.queryByRole('link', { name: 'Engager son entreprise' })
    ).toBeNull();
  });
});

describe('NavPublicItemMobile', () => {
  it('renders a link that tracks and calls onClick', () => {
    const onClick = jest.fn();
    renderWithProviders(
      <NavPublicItemMobile item={LINKS[0]} onClick={onClick} />
    );
    fireEvent.click(screen.getByRole('link', { name: 'Devenir coach' }));
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.HEADER_AIDER_CLIC);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('works without onClick', () => {
    renderWithProviders(<NavPublicItemMobile item={LINKS[0]} />);
    fireEvent.click(screen.getByRole('link', { name: 'Devenir coach' }));
    expect(gaEvent).toHaveBeenCalledTimes(1);
  });

  it('flattens the children of a group into links', () => {
    const onClick = jest.fn();
    renderWithProviders(
      <NavPublicItemMobile item={LINKS[3]} onClick={onClick} />
    );
    expect(screen.queryByText('Engager son entreprise')).toBeNull();
    fireEvent.click(
      screen.getByRole('link', { name: 'Engager mes collaborateurs' })
    );
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.HEADER_ENGAGER_COLLABORATEURS_CLIC
    );
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('link', { name: 'Recruter inclusif' }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders nothing for an entry without href and children', () => {
    const { container } = renderWithProviders(
      <NavPublicItemMobile
        item={{ name: 'Vide', tag: GA_TAGS.HEADER_AIDER_CLIC }}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('NavPublicMobile', () => {
  beforeEach(() => {
    // The panel items pick their platform variant from the same hook.
    (useIsDesktop as jest.Mock).mockReturnValue(false);
  });

  const openMenu = () => {
    renderWithProviders(<NavPublicMobile />);
    fireEvent.click(screen.getByRole('button'));
  };

  it('is closed by default', () => {
    renderWithProviders(<NavPublicMobile />);
    expect(screen.queryByText('Accueil')).toBeNull();
  });

  it('opens a panel with home, every link and the auth actions', () => {
    openMenu();
    expect(screen.getByRole('link', { name: 'Accueil' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(
      screen.getByRole('link', { name: 'Devenir coach' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Recruter inclusif' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Connexion' })).toBeInTheDocument();
  });

  it('toggles closed from the hamburger', () => {
    openMenu();
    // Once open, the hamburger turns into a close icon: first button.
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.queryByText('Accueil')).toBeNull();
  });

  it('closes after choosing a link', () => {
    openMenu();
    fireEvent.click(screen.getByRole('link', { name: 'Devenir coach' }));
    expect(screen.queryByText('Accueil')).toBeNull();
  });

  it('closes after choosing the home link', () => {
    openMenu();
    fireEvent.click(screen.getByRole('link', { name: 'Accueil' }));
    expect(screen.queryByText('Accueil')).toBeNull();
  });

  it('closes after choosing an auth action', () => {
    openMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Connexion' }));
    expect(screen.queryByText('Accueil')).toBeNull();
  });

  it('closes on a click outside the panel, and stays open on a click inside', () => {
    openMenu();
    fireEvent.mouseDown(screen.getByRole('link', { name: 'Accueil' }));
    expect(screen.getByText('Accueil')).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText('Accueil')).toBeNull();
  });
});
