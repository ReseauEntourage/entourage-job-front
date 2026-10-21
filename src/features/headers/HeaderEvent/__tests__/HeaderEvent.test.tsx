import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { EventType, PublicSensibilise } from '@/src/constants/events';
import { HeaderEvent } from '../HeaderEvent';

const mockIsMobile = jest.fn();
jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => !mockIsMobile(),
  useIsMobile: () => mockIsMobile(),
}));
jest.mock('@/src/components/ui/BackLink', () => ({
  BackLink: () => <span>back-link</span>,
}));
jest.mock(
  '@/src/features/backoffice/events/Event/EventParticipateButton/EventParticipateButton',
  () => ({
    EventParticipateButton: ({
      eventSalesForceId,
    }: {
      eventSalesForceId: string;
    }) => <span>participate:{eventSalesForceId}</span>,
  })
);
jest.mock(
  '@/src/features/backoffice/events/EventInfoSummary/EventInfoSummary',
  () => ({
    EventInfoSummary: () => <span>summary</span>,
  })
);

const baseProps = {
  salesForceId: 'sf1',
  name: 'Atelier CV',
  eventType: EventType.WELCOME_SESSION,
  startDate: '2026-01-01T10:00:00Z',
  mode: 'ONLINE',
  meetingLink: null,
  fullAddress: null,
  registrationCount: 3,
  isParticipating: false,
  publicSensibilise: [],
} as unknown as React.ComponentProps<typeof HeaderEvent>;

describe('HeaderEvent', () => {
  beforeEach(() => mockIsMobile.mockReturnValue(false));

  it('shows the event title, picture and summary on desktop without participate button', () => {
    render(<HeaderEvent {...baseProps} />);
    expect(
      screen.getByRole('heading', { name: 'Atelier CV' })
    ).toBeInTheDocument();
    expect(screen.getByAltText('Atelier CV')).toBeInTheDocument();
    expect(screen.getByText('summary')).toBeInTheDocument();
    expect(screen.queryByText(/participate:/)).not.toBeInTheDocument();
  });

  it('shows the participate button on mobile', () => {
    mockIsMobile.mockReturnValue(true);
    render(<HeaderEvent {...baseProps} />);
    expect(screen.getByText('participate:sf1')).toBeInTheDocument();
  });

  it('shows the young public badge only for young public events', () => {
    const { rerender } = render(<HeaderEvent {...baseProps} />);
    expect(screen.queryByText('100% jeunes')).not.toBeInTheDocument();
    rerender(
      <HeaderEvent
        {...baseProps}
        publicSensibilise={[PublicSensibilise.YOUNG_PUBLIC]}
      />
    );
    expect(screen.getByText('100% jeunes')).toBeInTheDocument();
  });
});
