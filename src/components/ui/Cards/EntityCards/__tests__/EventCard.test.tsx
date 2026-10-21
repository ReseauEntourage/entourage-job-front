import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { EventType, PublicSensibilise } from '@/src/constants/events';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { EventCard, EventCardProps } from '../EventCard/EventCard';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));
jest.mock('@/src/lib/gtag', () => ({ gaEvent: jest.fn() }));
jest.mock(
  '@/src/features/backoffice/events/EventInfoSummary/EventInfoSummary',
  () => ({
    EventInfoSummary: ({
      registrationCount,
    }: {
      registrationCount: number;
    }) => <span>summary:{registrationCount}</span>,
  })
);

const baseProps = {
  salesForceId: 'sf1',
  name: 'Atelier CV',
  startDate: '2026-01-01T10:00:00Z',
  eventType: EventType.WELCOME_SESSION,
  mode: 'ONLINE',
  meetingLink: null,
  fullAddress: null,
  registrationCount: 12,
  isParticipating: false,
  publicSensibilise: [],
} as unknown as EventCardProps;

describe('EventCard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('links to the event, shows its name and summary, tracks the click', () => {
    render(<EventCard {...baseProps} />);
    expect(
      screen.getByRole('heading', { name: 'Atelier CV' })
    ).toBeInTheDocument();
    expect(screen.getByText('summary:12')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toContain('sf1');
    fireEvent.click(link);
    expect(gaEvent).toHaveBeenCalledWith(GA_TAGS.PAGE_EVENTS_CARTE_CLIC);
  });

  it('falls back to the generic picture for an unknown event type', () => {
    render(<EventCard {...baseProps} eventType={'OTHER' as never} />);
    expect(screen.getByAltText('photo de Atelier CV')).toBeInTheDocument();
  });

  it('shows the registered badge only when participating', () => {
    const { rerender } = render(<EventCard {...baseProps} />);
    expect(screen.queryByText('Inscrit')).not.toBeInTheDocument();
    rerender(<EventCard {...baseProps} isParticipating />);
    expect(screen.getByText('Inscrit')).toBeInTheDocument();
  });

  it('shows the young public badge', () => {
    render(
      <EventCard
        {...baseProps}
        publicSensibilise={[PublicSensibilise.YOUNG_PUBLIC]}
      />
    );
    expect(screen.getByText('100% jeunes')).toBeInTheDocument();
  });
});
