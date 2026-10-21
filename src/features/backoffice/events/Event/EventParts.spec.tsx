import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { useRouter } from 'next/router';
import React from 'react';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { Event } from './Event';
import { EventDescription } from './EventDescription/EventDescription';
import { EventParticipants } from './EventParticipants/EventParticipants';
import { Item as ParticipantItem } from './EventParticipants/Item';
import { EventSequences } from './EventSequences/EventSequences';
import { useSelectSelectedEvent } from './useSelectedEvent';

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
let mockDesktop = true;
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => (mockDesktop ? 1280 : 400),
  useWindowSize: () => [mockDesktop ? 1280 : 400, 800],
}));
jest.mock('./useSelectedEvent', () => ({ useSelectSelectedEvent: jest.fn() }));
let mockParticipantsLoading = false;
jest.mock('@/src/use-cases/events', () => {
  const actual = jest.requireActual('@/src/use-cases/events');
  return {
    ...actual,
    fetchSelectedEventSelectors: {
      ...actual.fetchSelectedEventSelectors,
      selectIsFetchSelectedEventRequested: () => mockParticipantsLoading,
    },
  };
});
jest.mock('@/src/features/headers/HeaderEvent/HeaderEvent', () => ({
  HeaderEvent: ({ name }: any) => (
    <div data-testid="part">{`header:${name}`}</div>
  ),
}));
jest.mock('./EventHighlights/EventHighlights', () => ({
  EventHighlights: () => <div data-testid="part">highlights</div>,
}));
jest.mock('./EventActions/EventActions', () => ({
  EventActions: () => <div data-testid="part">actions</div>,
}));
jest.mock('./EventInvitationToAction/EventInvitationToAction', () => ({
  EventInvitationToAction: () => <div data-testid="part">invitation</div>,
}));

const participant = (id: string) => ({
  id,
  firstName: `F${id}`,
  lastName: `L${id}`,
  role: 'Candidat',
  userProfile: { hasPicture: false },
});

describe('Event page', () => {
  beforeEach(() => {
    mockDesktop = true;
    (useSelectSelectedEvent as jest.Mock).mockReturnValue({
      name: 'Atelier',
      description: 'Desc',
      sequences: ['A'],
      participants: [],
    });
  });

  it('shows the invitation to participate in the left column on desktop', () => {
    renderWithProviders(<Event />);

    const parts = screen.getAllByTestId('part').map((el) => el.textContent);
    expect(parts).toContain('header:Atelier');
    expect(parts).toContain('invitation');
    expect(parts).toContain('actions');
  });

  it('does not repeat the invitation on mobile', () => {
    mockDesktop = false;
    renderWithProviders(<Event />);

    const parts = screen.getAllByTestId('part').map((el) => el.textContent);
    expect(parts).not.toContain('invitation');
    expect(parts).toContain('actions');
  });
});

describe('EventDescription', () => {
  it('renders nothing without description', () => {
    const { container } = render(<EventDescription />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the description', () => {
    render(<EventDescription description="Un atelier" />);

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Un atelier')).toBeInTheDocument();
  });
});

describe('EventSequences', () => {
  [undefined, []].forEach((sequences) => {
    it(`renders nothing for ${JSON.stringify(sequences)}`, () => {
      const { container } = render(<EventSequences sequences={sequences} />);

      expect(container).toBeEmptyDOMElement();
    });
  });

  it('numbers the programme steps from 1', () => {
    render(<EventSequences sequences={['Accueil', 'Atelier']} />);

    expect(screen.getByText('Programme')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Atelier')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});

describe('EventParticipants', () => {
  beforeEach(() => {
    mockParticipantsLoading = false;
  });

  it('invites to be the first participant when there is none', () => {
    renderWithProviders(<EventParticipants participants={[]} />);

    expect(
      screen.getByText(/Aucun participant pour le moment/)
    ).toBeInTheDocument();
  });

  it('lists up to ten participants and counts the others (singular)', () => {
    const participants = Array.from({ length: 11 }, (_, i) =>
      participant(`${i}`)
    );
    renderWithProviders(
      <EventParticipants participants={participants as any} />
    );

    expect(screen.getAllByText(/^F\d+ L\d+$/)).toHaveLength(10);
    expect(screen.getByText('et 1 autre participant')).toBeInTheDocument();
  });

  it('pluralises the count of additional participants', () => {
    const participants = Array.from({ length: 13 }, (_, i) =>
      participant(`${i}`)
    );
    renderWithProviders(
      <EventParticipants participants={participants as any} />
    );

    expect(screen.getByText('et 3 autres participants')).toBeInTheDocument();
  });

  it('hides participants while the event is loading', () => {
    mockParticipantsLoading = true;
    renderWithProviders(
      <EventParticipants participants={[participant('1')] as any} />
    );

    expect(screen.queryByText('F1 L1')).not.toBeInTheDocument();
  });
});

describe('EventParticipants Item', () => {
  it('navigates to the participant profile on click', () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    renderWithProviders(
      <ParticipantItem participant={participant('p1') as any} />
    );

    fireEvent.click(screen.getByText('Fp1 Lp1'));

    expect(push).toHaveBeenCalledWith('/backoffice/profile/p1');
  });
});
