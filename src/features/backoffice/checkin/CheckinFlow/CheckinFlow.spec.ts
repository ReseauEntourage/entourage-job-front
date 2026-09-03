// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { ConversationCheckin } from '@/src/api/types';
import {
  CheckinExchangeFrequency,
  CheckinExchangeMode,
  CheckinPerceivedSupport,
  CheckinStillInTouch,
} from '@/src/constants/checkin';
import { getFirstUnansweredStep } from './CheckinFlow';
import { CheckinStepId } from './checkin-flow.constants';

const baseCheckin: ConversationCheckin = {
  id: 'checkin-1',
  conversationId: 'conversation-1',
  userId: 'user-1',
  stillInTouch: null,
  exchangeModes: null,
  exchangeFrequency: null,
  perceivedBenefits: null,
  employmentType: null,
  perceivedSupport: null,
  rating: null,
  comment: null,
  contactRequestedAt: null,
  noteSentAt: null,
  completedAt: null,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
};

describe('getFirstUnansweredStep', () => {
  it('resumes at STILL_IN_TOUCH when nothing has been answered', () => {
    expect(getFirstUnansweredStep(baseCheckin)).toBe(
      CheckinStepId.STILL_IN_TOUCH
    );
  });

  it('resumes at EXCHANGE_MODES once stillInTouch is answered', () => {
    const checkin = { ...baseCheckin, stillInTouch: CheckinStillInTouch.YES };

    expect(getFirstUnansweredStep(checkin)).toBe(CheckinStepId.EXCHANGE_MODES);
  });

  it('resumes at EXCHANGE_FREQUENCY once exchangeModes is answered', () => {
    const checkin = {
      ...baseCheckin,
      stillInTouch: CheckinStillInTouch.YES,
      exchangeModes: [CheckinExchangeMode.PHONE],
    };

    expect(getFirstUnansweredStep(checkin)).toBe(
      CheckinStepId.EXCHANGE_FREQUENCY
    );
  });

  it('resumes at PERCEIVED_BENEFITS once exchangeFrequency is answered', () => {
    const checkin = {
      ...baseCheckin,
      stillInTouch: CheckinStillInTouch.YES,
      exchangeModes: [CheckinExchangeMode.PHONE],
      exchangeFrequency: CheckinExchangeFrequency.WEEKLY,
    };

    expect(getFirstUnansweredStep(checkin)).toBe(
      CheckinStepId.PERCEIVED_BENEFITS
    );
  });

  it('resumes at PERCEIVED_SUPPORT once perceivedBenefits is answered (employmentType not required to advance)', () => {
    const checkin = {
      ...baseCheckin,
      stillInTouch: CheckinStillInTouch.YES,
      exchangeModes: [CheckinExchangeMode.PHONE],
      exchangeFrequency: CheckinExchangeFrequency.WEEKLY,
      perceivedBenefits: ['CONCRETE_ADVICE'],
    };

    expect(getFirstUnansweredStep(checkin)).toBe(
      CheckinStepId.PERCEIVED_SUPPORT
    );
  });

  it('resumes at RATING once perceivedSupport is answered', () => {
    const checkin = {
      ...baseCheckin,
      stillInTouch: CheckinStillInTouch.YES,
      exchangeModes: [CheckinExchangeMode.PHONE],
      exchangeFrequency: CheckinExchangeFrequency.WEEKLY,
      perceivedBenefits: ['CONCRETE_ADVICE'],
      perceivedSupport: CheckinPerceivedSupport.YES_A_BIT,
    };

    expect(getFirstUnansweredStep(checkin)).toBe(CheckinStepId.RATING);
  });

  it('treats an empty array field as unanswered', () => {
    const checkin = {
      ...baseCheckin,
      stillInTouch: CheckinStillInTouch.YES,
      exchangeModes: [],
    };

    expect(getFirstUnansweredStep(checkin)).toBe(CheckinStepId.EXCHANGE_MODES);
  });
});
