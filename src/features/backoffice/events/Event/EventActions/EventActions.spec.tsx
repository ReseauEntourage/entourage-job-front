import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { EventMode } from '@/src/constants/events';
import { renderWithProviders } from '@/src/store/testUtils/renderWithProviders';
import { EventInvitationToAction } from '../EventInvitationToAction/EventInvitationToAction';
import { EventActions } from './EventActions';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/components/ui/Button/ButtonAddToCalendar', () => ({
  ButtonAddToCalendar: ({ id, title, children }: any) => (
    <button type="button">
      calendar:{id}:{title}
      {children}
    </button>
  ),
}));
jest.mock('@/src/components/ui/Button/ButtonShare', () => ({
  ButtonShare: ({ url, children }: any) => (
    <button type="button" data-url={url}>
      {children}
    </button>
  ),
}));

const props = {
  name: 'Atelier CV',
  description: 'Un atelier',
  salesForceId: 'sf-1',
  startDate: '2026-10-21T14:30:00.000Z',
  endDate: '2026-10-21T16:00:00.000Z',
  mode: EventMode.ONLINE,
  meetingLink: null,
  fullAddress: null,
} as any;

describe('EventActions', () => {
  it('invites a non registered user to participate, without calendar', () => {
    renderWithProviders(<EventActions {...props} isParticipating={false} />);
    expect(screen.getByText('Non inscrit')).toBeInTheDocument();
    expect(screen.getByText("Participer à l'événement")).toBeInTheDocument();
    expect(screen.queryByText(/calendar:/)).toBeNull();
  });

  it('lets a registered user unregister and add the event to their calendar', () => {
    renderWithProviders(<EventActions {...props} isParticipating />);
    expect(screen.getByText('Inscrit')).toBeInTheDocument();
    expect(screen.getByText('Se désinscrire')).toBeInTheDocument();
    expect(screen.getByText(/calendar:sf-1:Atelier CV/)).toBeInTheDocument();
  });

  it('shares the event page URL', () => {
    renderWithProviders(<EventActions {...props} isParticipating={false} />);
    const share = screen.getByText(/Partager l'événement/).closest('button');
    expect(share).toHaveAttribute(
      'data-url',
      `${window.location.origin}/backoffice/events/sf-1`
    );
  });
});

describe('EventInvitationToAction', () => {
  it('asks whether to participate, with the share button', () => {
    renderWithProviders(
      <EventInvitationToAction {...props} isParticipating={false} />
    );
    expect(
      screen.getByText("Souhaitez-vous participer à l'événement ?")
    ).toBeInTheDocument();
    expect(screen.getByText("Participer à l'événement")).toBeInTheDocument();
    expect(screen.queryByText(/calendar:/)).toBeNull();
    expect(screen.getByText(/Partager l'événement/)).toBeInTheDocument();
  });

  it('adds the calendar button once registered, with an empty description fallback', () => {
    renderWithProviders(
      <EventInvitationToAction
        {...props}
        description={undefined}
        isParticipating
      />
    );
    expect(screen.getByText('Se désinscrire')).toBeInTheDocument();
    expect(screen.getByText(/calendar:sf-1:Atelier CV/)).toBeInTheDocument();
  });
});
