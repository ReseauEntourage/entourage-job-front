import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { EventMode } from '@/src/constants/events';
import { downloadICS, generateICSContent } from '@/src/utils/ics';
import { ButtonAddToCalendar } from '../ButtonAddToCalendar';
import { ButtonMultiple } from '../ButtonMultiple';
import { ButtonPost } from '../ButtonPost';
import { ButtonShare } from '../ButtonShare';

jest.mock('@/src/utils/ics', () => ({
  generateICSContent: jest.fn(() => 'ICS-CONTENT'),
  downloadICS: jest.fn(),
}));

describe('ButtonPost', () => {
  it('runs the action, is disabled meanwhile, then re-enabled', async () => {
    let resolveAction: () => void = () => {};
    const action = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAction = resolve;
        })
    );
    render(<ButtonPost text="Envoyer" action={action} />);
    fireEvent.click(screen.getByRole('button'));
    expect(action).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button')).toBeDisabled();

    // A second click while loading does nothing
    fireEvent.click(screen.getByRole('button'));
    expect(action).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveAction();
    });
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('shows the icon when idle and respects disabled', () => {
    render(
      <ButtonPost
        text="Envoyer"
        action={jest.fn()}
        icon={<i data-testid="icon" />}
        disabled
      />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('hides the icon when the loading state is overridden', () => {
    render(
      <ButtonPost
        text="Envoyer"
        action={jest.fn()}
        icon={<i data-testid="icon" />}
        isLoadingOverride
      />
    );
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });
});

describe('ButtonShare', () => {
  const originalShare = navigator.share;
  const writeText = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    writeText.mockReset();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    Object.defineProperty(navigator, 'share', {
      value: originalShare,
      configurable: true,
    });
  });

  it('uses the native share sheet when available', () => {
    const share = jest.fn();
    Object.defineProperty(navigator, 'share', {
      value: share,
      configurable: true,
    });
    render(
      <ButtonShare url="https://x.test" title="T" description="D">
        Partager
      </ButtonShare>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(share).toHaveBeenCalledWith({
      title: 'T',
      text: 'D',
      url: 'https://x.test',
    });
    expect(writeText).not.toHaveBeenCalled();
  });

  it('copies the link and confirms for 2 seconds otherwise', () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
    });
    render(<ButtonShare url="https://x.test">Partager</ButtonShare>);
    fireEvent.click(screen.getByRole('button'));
    expect(writeText).toHaveBeenCalledWith('https://x.test');
    expect(screen.getByText('Lien copié !')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Partager')).toBeInTheDocument();
  });
});

describe('ButtonAddToCalendar', () => {
  beforeEach(() => jest.clearAllMocks());

  const baseProps = {
    id: 'e1',
    description: 'Desc',
    startDate: '2026-01-01T10:00:00Z',
    endDate: '2026-01-01T11:00:00Z',
    mode: EventMode.ONLINE,
    meetingLink: 'https://meet.test',
    fullAddress: null,
  };

  it('generates and downloads an ICS file named after a slug of the title', () => {
    render(
      <ButtonAddToCalendar {...baseProps} title="Atelier CV : été 2026 !">
        Ajouter
      </ButtonAddToCalendar>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(generateICSContent).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'e1', title: 'Atelier CV : été 2026 !' })
    );
    expect(downloadICS).toHaveBeenCalledWith(
      'ICS-CONTENT',
      'atelier-cv-t-2026.ics'
    );
  });

  it('falls back to a generic file name', () => {
    render(
      <ButtonAddToCalendar {...baseProps} title="!!!">
        Ajouter
      </ButtonAddToCalendar>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(downloadICS).toHaveBeenCalledWith('ICS-CONTENT', 'event.ics');
  });
});

describe('ButtonMultiple', () => {
  it('opens a menu of buttons and runs the clicked entry', () => {
    const onFirst = jest.fn();
    render(
      <ButtonMultiple
        id="multi"
        buttons={[
          { label: 'Premier', onClick: onFirst, dataTestId: 'first' },
          { label: 'Second', onClick: jest.fn() },
        ]}
      >
        Actions
      </ButtonMultiple>
    );
    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByTestId('first'));
    expect(onFirst).toHaveBeenCalledTimes(1);
  });

  it('does not open when disabled', () => {
    const onFirst = jest.fn();
    render(
      <ButtonMultiple
        id="multi"
        disabled
        buttons={[{ label: 'Premier', onClick: onFirst }]}
      >
        Actions
      </ButtonMultiple>
    );
    expect(screen.getByText('Actions').closest('button')).toBeDisabled();
  });

  it('closes when clicking outside', () => {
    render(
      <div>
        <span>dehors</span>
        <ButtonMultiple
          id="multi"
          buttons={[{ label: 'Premier', onClick: jest.fn() }]}
        >
          Actions
        </ButtonMultiple>
      </div>
    );
    fireEvent.click(screen.getByText('Actions'));
    fireEvent.click(screen.getByText('dehors'));
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
