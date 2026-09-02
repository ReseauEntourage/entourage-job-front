// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { CheckinState } from '@/src/api/types';
import { getDisplayCheckinBanner } from './MessagingConversation';

describe('getDisplayCheckinBanner', () => {
  it('is false when the checkin state has not loaded yet', () => {
    expect(getDisplayCheckinBanner(undefined)).toBe(false);
  });

  it('is false when the conversation is not eligible', () => {
    const checkinState: CheckinState = {
      eligible: false,
      otherParticipant: null,
      checkin: null,
    };

    expect(getDisplayCheckinBanner(checkinState)).toBe(false);
  });

  it('is true when eligible and no checkin exists yet', () => {
    const checkinState: CheckinState = {
      eligible: true,
      otherParticipant: null,
      checkin: null,
    };

    expect(getDisplayCheckinBanner(checkinState)).toBe(true);
  });

  it('stays true for a checkin that has been started but not completed', () => {
    const checkinState = {
      eligible: true,
      otherParticipant: null,
      checkin: { completedAt: null },
    } as CheckinState;

    expect(getDisplayCheckinBanner(checkinState)).toBe(true);
  });

  it('is false once the checkin is completed', () => {
    const checkinState = {
      eligible: true,
      otherParticipant: null,
      checkin: { completedAt: '2026-09-02T00:00:00.000Z' },
    } as CheckinState;

    expect(getDisplayCheckinBanner(checkinState)).toBe(false);
  });
});
