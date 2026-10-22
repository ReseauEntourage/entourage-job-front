// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import { asyncTimeout } from './asyncTimeout';

describe('asyncTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves only once the delay has elapsed', async () => {
    const done = jest.fn();
    asyncTimeout(1000).then(done);

    await jest.advanceTimersByTimeAsync(999);
    expect(done).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1);
    expect(done).toHaveBeenCalledTimes(1);
  });
});
