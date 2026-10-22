import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { EventMode } from '@/src/constants/events';
import { EventInfoSummary } from './EventInfoSummary';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const base = {
  startDate: '2026-10-21T14:30:00.000Z',
  mode: EventMode.ONLINE,
  meetingLink: 'meet.example.com/abc',
  fullAddress: null,
  registrationCount: 3,
  isParticipating: false,
} as any;

describe('EventInfoSummary', () => {
  it('shows the start date in French', () => {
    render(<EventInfoSummary {...base} />);
    expect(screen.getByText(/^Le 21 octobre 2026/)).toBeInTheDocument();
  });

  it('hides the meeting link from users who did not register', () => {
    render(<EventInfoSummary {...base} />);
    expect(screen.getByText('En visio')).toBeInTheDocument();
    expect(screen.queryByText('meet.example.com/abc')).toBeNull();
  });

  it('gives the meeting link to participants, adding the protocol when missing', () => {
    render(<EventInfoSummary {...base} isParticipating />);
    expect(
      screen.getByRole('link', { name: 'meet.example.com/abc' })
    ).toHaveAttribute('href', 'https://meet.example.com/abc');
  });

  it('keeps an explicit protocol', () => {
    render(
      <EventInfoSummary
        {...base}
        isParticipating
        meetingLink="http://meet.example.com/x"
      />
    );
    expect(
      screen.getByRole('link', { name: 'http://meet.example.com/x' })
    ).toHaveAttribute('href', 'http://meet.example.com/x');
  });

  it('hides the link in compact mode, or when there is none', () => {
    const { rerender } = render(
      <EventInfoSummary {...base} isParticipating compact />
    );
    expect(screen.queryByRole('link')).toBeNull();
    rerender(<EventInfoSummary {...base} isParticipating meetingLink={null} />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('shows the address of an in-person event, or a generic label', () => {
    const { rerender } = render(
      <EventInfoSummary
        {...base}
        mode={EventMode.IN_PERSON}
        fullAddress="1 rue de Paris, 75001 Paris"
      />
    );
    expect(screen.getByText('1 rue de Paris, 75001 Paris')).toBeInTheDocument();
    expect(screen.queryByText('En visio')).toBeNull();
    rerender(<EventInfoSummary {...base} mode={EventMode.IN_PERSON} />);
    expect(screen.getByText('En présentiel')).toBeInTheDocument();
  });

  it('does not list participants by default', () => {
    render(<EventInfoSummary {...base} />);
    expect(screen.queryByText(/participant/)).toBeNull();
  });

  it('counts participants when asked, with plural rules', () => {
    const { rerender } = render(
      <EventInfoSummary {...base} displayParticipants registrationCount={0} />
    );
    expect(screen.getByText('Aucun participant')).toBeInTheDocument();
    rerender(
      <EventInfoSummary {...base} displayParticipants registrationCount={1} />
    );
    expect(screen.getByText('1 participant')).toBeInTheDocument();
    rerender(
      <EventInfoSummary {...base} displayParticipants registrationCount={5} />
    );
    expect(screen.getByText('5 participants')).toBeInTheDocument();
  });
});
