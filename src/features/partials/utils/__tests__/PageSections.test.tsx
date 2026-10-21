import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { Impact } from '../../common/Impact/Impact';
import { NousSoutenir } from '../../common/NousSoutenir/NousSoutenir';
import { CoachFormatHighlights } from '../../pages/Aider/CoachFormatHighlights/CoachFormatHighlights';
import { Figures } from '../../pages/HomePage/Figures/Figures';
import { SimpleSection } from '../../pages/Partenaires/SimpleSection';
import { MultipleCTA } from '../MultipleCTA/MultipleCTA';
import { NumberCard } from '../NumberGrid/NumberCard';
import { PageHero } from '../PageHero/PageHero';

jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
  useIsMobile: () => false,
}));
jest.mock('react-countup', () => ({
  __esModule: true,
  default: ({ end }: { end: number }) => <span>count:{end}</span>,
}));
jest.mock('react-visibility-sensor', () => ({
  __esModule: true,
  default: ({
    children,
  }: {
    children: (state: { isVisible: boolean }) => React.ReactNode;
  }) => <>{children({ isVisible: true })}</>,
}));

beforeEach(() => jest.clearAllMocks());

describe('PageHero', () => {
  it('shows the title, description and image', () => {
    render(
      <PageHero
        img="/hero.jpg"
        alt="Illustration"
        title="Bienvenue"
        description="Une description"
      />
    );
    expect(
      screen.getByRole('heading', { name: 'Bienvenue' })
    ).toBeInTheDocument();
    expect(screen.getByText('Une description')).toBeInTheDocument();
    expect(screen.getByAltText('Illustration')).toBeInTheDocument();
  });

  it('shows no call to action by default', () => {
    render(<PageHero img="/hero.jpg" title="Bienvenue" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a single call to action', () => {
    const onClick = jest.fn();
    render(
      <PageHero
        img="/hero.jpg"
        title="T"
        cta={{ label: 'Go', onClick, dataTest: 'cta' }}
      />
    );
    fireEvent.click(screen.getByTestId('cta'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders several calls to action', () => {
    const first = jest.fn();
    const second = jest.fn();
    render(
      <PageHero
        img="/hero.jpg"
        title="T"
        cta={[
          { label: 'Un', onClick: first },
          { label: 'Deux', onClick: second, variant: 'secondary' },
        ]}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Deux' }));
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('renders nothing for an empty list of calls to action', () => {
    render(<PageHero img="/hero.jpg" title="T" cta={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('MultipleCTA', () => {
  const data = [
    {
      title: 'Étape un',
      text: 'Texte un',
      img: '/un.png',
      button: { label: 'Action', onClick: jest.fn(), dataTestId: 'action-1' },
    },
    { title: 'Étape deux', text: 'Texte deux' },
  ];

  it('renders each item with its text', () => {
    const { container } = render(<MultipleCTA data={data} />);
    expect(screen.getByText('Étape un')).toBeInTheDocument();
    expect(screen.getByText('Texte deux')).toBeInTheDocument();
    // Only the first item has a picture
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  it('numbers the items on demand', () => {
    render(<MultipleCTA data={data} showNumbers />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('draws horizontal dividers on demand', () => {
    const { container } = render(
      <MultipleCTA data={data} showHorizontalDividers />
    );
    expect(container.querySelectorAll('hr').length).toBeGreaterThanOrEqual(2);
  });

  it('runs the button action', () => {
    render(<MultipleCTA data={data} />);
    fireEvent.click(screen.getByTestId('action-1'));
    expect(data[0].button?.onClick).toHaveBeenCalledTimes(1);
  });
});

describe('NumberCard', () => {
  it('shows the value, description and sub description', () => {
    render(
      <NumberCard value={42} description="Candidats" subDescription="en 2025" />
    );
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Candidats')).toBeInTheDocument();
    expect(screen.getByText('en 2025')).toBeInTheDocument();
  });

  it('copes with long values', () => {
    render(<NumberCard value="1 234 567 €" description="Économies" />);
    expect(screen.getByText('1 234 567 €')).toBeInTheDocument();
  });

  it('animates the number when asked', () => {
    render(<NumberCard value={42} description="Candidats" animate />);
    expect(screen.getByText('count:42')).toBeInTheDocument();
  });
});

describe('Impact', () => {
  const insights = [
    { value: '80%', description: 'retrouvent un emploi' },
    { value: '500', description: 'coachs', illu: <i data-testid="illu" /> },
  ];

  it('shows the title and every insight', () => {
    render(<Impact title="Notre impact" insights={insights} />);
    expect(
      screen.getByRole('heading', { name: 'Notre impact' })
    ).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('coachs')).toBeInTheDocument();
    expect(screen.getByTestId('illu')).toBeInTheDocument();
  });

  it('only invites to download the impact study on demand', () => {
    const { rerender } = render(<Impact title="T" insights={insights} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(
      <Impact
        title="T"
        insights={insights}
        inviteToShowMore
        invertBgColor
        gaEventTag={GA_TAGS.HOME_CHIFFRES_MESURE_D_IMPACT_CLICK}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.HOME_CHIFFRES_MESURE_D_IMPACT_CLICK
    );
  });

  it('does not track without a tag', () => {
    render(<Impact title="T" insights={insights} inviteToShowMore />);
    fireEvent.click(screen.getByRole('button'));
    expect(gaEvent).not.toHaveBeenCalled();
  });
});

describe('NousSoutenir', () => {
  const original = process.env.NEXT_PUBLIC_DONATION_LINK;
  afterEach(() => {
    process.env.NEXT_PUBLIC_DONATION_LINK = original;
  });

  it('links each donation amount to the donation page in a new tab', () => {
    process.env.NEXT_PUBLIC_DONATION_LINK = 'https://don.test/?a=1';
    render(<NousSoutenir />);
    expect(
      screen.getByRole('heading', { name: 'Nous soutenir' })
    ).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(1);
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('href')).toMatch(
        /^https:\/\/don\.test\/\?a=1&frequency=once&amount=\d+$/
      );
    });
  });

  it('tracks the free donation button', () => {
    render(<NousSoutenir />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.HOME_NOUS_SOUTENIR_FAIRE_UN_DON_CLICK
    );
  });
});

describe('CoachFormatHighlights', () => {
  it('invites to become a coach and tracks the registration', () => {
    render(<CoachFormatHighlights />);
    const link = screen.getByRole('link', { name: 'Je deviens coach' });
    expect(link).toHaveAttribute('href', '/wizard');
    fireEvent.click(link.firstElementChild as Element);
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.PAGE_AIDER_INSCRIPTION_COACH_CLIC
    );
  });
});

describe('Figures', () => {
  it('tracks the download of the impact measure', () => {
    render(<Figures />);
    const button = screen.getByRole('button', { name: /mesure d.impact/ });
    fireEvent.click(button);
    expect(gaEvent).toHaveBeenCalledWith(
      GA_TAGS.HOME_CHIFFRES_MESURE_D_IMPACT_CLICK
    );
  });
});

describe('SimpleSection', () => {
  it('shows the title, text and children', () => {
    render(
      <SimpleSection id="s" title="Titre" text="Texte">
        <span>Enfant</span>
      </SimpleSection>
    );
    expect(screen.getByRole('heading', { name: 'Titre' })).toBeInTheDocument();
    expect(screen.getByText('Texte')).toBeInTheDocument();
    expect(screen.getByText('Enfant')).toBeInTheDocument();
    expect(document.getElementById('s')).toBeInTheDocument();
  });

  it('uses a smaller heading for small texts', () => {
    render(
      <SimpleSection id="s" title="Titre" text="Petit" fontSize="small" />
    );
    expect(
      screen.getByRole('heading', { level: 4, name: 'Petit' })
    ).toBeInTheDocument();
  });

  it('renders an optional button', () => {
    const onClick = jest.fn();
    render(
      <SimpleSection
        id="s"
        title="T"
        text="X"
        button={{ label: 'Voir', onClick }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Voir/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
