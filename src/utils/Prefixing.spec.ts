// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';

describe('addPrefix', () => {
  const env = process.env as Record<string, string | undefined>;
  const originalNodeEnv = env.NODE_ENV;
  const originalCdn = env.NEXT_PUBLIC_CDN_URL;

  afterEach(() => {
    env.NODE_ENV = originalNodeEnv;
    env.NEXT_PUBLIC_CDN_URL = originalCdn;
    jest.resetModules();
  });

  const load = (nodeEnv: string) => {
    env.NODE_ENV = nodeEnv;
    let mod: typeof import('./Prefixing') | undefined;
    jest.isolateModules(() => {
      mod = require('./Prefixing');
    });
    return mod!.addPrefix;
  };

  it('returns the path untouched outside production', () => {
    env.NEXT_PUBLIC_CDN_URL = 'https://cdn.test';
    expect(load('test')('/static/img/a.png')).toBe('/static/img/a.png');
  });

  it('prefixes /static paths with the CDN url in production', () => {
    env.NEXT_PUBLIC_CDN_URL = 'https://cdn.test';
    expect(load('production')('/foo/static/img/a.png')).toBe(
      'https://cdn.test/static/img/a.png'
    );
  });

  it('uses an empty prefix when no CDN is configured', () => {
    delete env.NEXT_PUBLIC_CDN_URL;
    expect(load('production')('/static/a.png')).toBe('/static/a.png');
  });

  it('leaves absolute urls and non-static paths untouched in production', () => {
    env.NEXT_PUBLIC_CDN_URL = 'https://cdn.test';
    const addPrefix = load('production');
    expect(addPrefix('https://x.com/static/a.png')).toBe(
      'https://x.com/static/a.png'
    );
    expect(addPrefix('http://x.com/static/a.png')).toBe(
      'http://x.com/static/a.png'
    );
    expect(addPrefix('/images/a.png')).toBe('/images/a.png');
    expect(addPrefix('')).toBe('');
  });
});
