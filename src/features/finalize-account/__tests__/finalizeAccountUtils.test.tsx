// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { Api } from '@/src/api';
import { createTestStore } from '@/src/store/testUtils/createTestStore';
import { seedAccessToken } from '@/src/store/testUtils/seedAccessToken';
import {
  currentUserApi,
  FETCH_USER_FIXED_CACHE_KEY,
} from '@/src/use-cases/current-user';
import { waitForIdentityRefresh } from '../FinalizeAccount/FinalizeAccount';
import { getTokenExpirationDate } from '../getTokenExpirationDate';

jest.mock('@/src/api');

const mockedApi = Api as jest.Mocked<typeof Api>;

const encode = (payload: object) =>
  `header.${btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')}.signature`;

describe('getTokenExpirationDate', () => {
  it('reads the exp claim as a date', () => {
    const date = getTokenExpirationDate(encode({ exp: 1_700_000_000 }));
    expect(date?.getTime()).toBe(1_700_000_000_000);
  });

  it('supports base64url payloads', () => {
    // "?>>" in base64 is "Pz4+": exercises the - and _ replacements.
    const token = encode({ exp: 1, note: '???>>>' });
    expect(getTokenExpirationDate(token)?.getTime()).toBe(1000);
  });

  it('returns null without a payload segment', () => {
    expect(getTokenExpirationDate('not-a-jwt')).toBeNull();
  });

  it('returns null for an undecodable payload', () => {
    expect(getTokenExpirationDate('a.%%%.c')).toBeNull();
    expect(getTokenExpirationDate(`a.${btoa('not json')}.c`)).toBeNull();
  });

  it('returns null when exp is missing or not a number', () => {
    expect(getTokenExpirationDate(encode({}))).toBeNull();
    expect(getTokenExpirationDate(encode({ exp: '123' }))).toBeNull();
  });
});

describe('waitForIdentityRefresh', () => {
  const startFetchUser = (store: ReturnType<typeof createTestStore>) =>
    store.dispatch(
      currentUserApi.endpoints.fetchUser.initiate(undefined, {
        fixedCacheKey: FETCH_USER_FIXED_CACHE_KEY,
      })
    );

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    seedAccessToken('token');
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves with the identity of the first request started afterwards', async () => {
    const store = createTestStore();
    mockedApi.getCurrentIdentity.mockResolvedValue({
      data: { id: 'u1', onboardingStatus: 'done' },
    } as never);
    const waiting = waitForIdentityRefresh(store, undefined);
    startFetchUser(store);
    await expect(waiting).resolves.toMatchObject({ id: 'u1' });
  });

  it('ignores the request that was already there before', async () => {
    jest.useFakeTimers();
    const store = createTestStore();
    mockedApi.getCurrentIdentity.mockResolvedValue({
      data: { id: 'old', onboardingStatus: 'done' },
    } as never);
    await startFetchUser(store);
    const previous = (
      store.getState() as never as {
        api: { mutations: Record<string, { requestId?: string }> };
      }
    ).api.mutations[FETCH_USER_FIXED_CACHE_KEY]?.requestId;
    const waiting = waitForIdentityRefresh(store, previous);
    const outcome = jest.fn();
    waiting.then(outcome, outcome);
    await jest.advanceTimersByTimeAsync(100);
    expect(outcome).not.toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(15000);
    await expect(waiting).rejects.toThrow('IDENTITY_REFRESH_TIMEOUT');
  });

  it('rejects when the refresh fails', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const store = createTestStore();
    mockedApi.getCurrentIdentity.mockRejectedValue(new Error('boom'));
    const waiting = waitForIdentityRefresh(store, undefined);
    startFetchUser(store);
    await expect(waiting).rejects.toBeDefined();
    consoleError.mockRestore();
  });
});
