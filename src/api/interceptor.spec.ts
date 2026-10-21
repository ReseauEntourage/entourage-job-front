// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { STORAGE_KEYS } from '@/src/constants';
import { addAxiosInterceptors } from './interceptor';

function setup() {
  const use = jest.fn();
  addAxiosInterceptors({ interceptors: { request: { use } } } as any);
  const [onFulfilled, onRejected] = use.mock.calls[0];
  return { onFulfilled, onRejected };
}

describe('addAxiosInterceptors', () => {
  afterEach(() => localStorage.clear());

  it('adds the bearer token of the stored access token to requests', () => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, 'abc');
    const { onFulfilled } = setup();
    const config = { headers: {} as Record<string, string> };
    expect(onFulfilled(config).headers.authorization).toBe('Bearer abc');
  });

  it('leaves the request untouched without a stored token', () => {
    const { onFulfilled } = setup();
    const config = { headers: {} as Record<string, string> };
    expect(onFulfilled(config).headers.authorization).toBeUndefined();
  });

  it('rejects request errors unchanged', async () => {
    const { onRejected } = setup();
    const error = new Error('request failed');
    await expect(onRejected(error)).rejects.toBe(error);
  });
});
