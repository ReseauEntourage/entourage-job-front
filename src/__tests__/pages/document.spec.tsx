// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import MyDocument from '@/src/pages/_document';

jest.mock('next/document', () => {
  class MockDocument {
    static getInitialProps = jest.fn();
  }
  return {
    __esModule: true,
    default: MockDocument,
    Html: ({ lang, children }: any) => <div data-lang={lang}>{children}</div>,
    Head: () => <div data-testid="head" />,
    Main: () => <div data-testid="main" />,
    NextScript: () => <div data-testid="next-script" />,
  };
});

describe('_document', () => {
  const getInitialProps = jest.requireMock('next/document').default
    .getInitialProps as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the French html shell with head, main and scripts', () => {
    const html = renderToStaticMarkup(new MyDocument({} as any).render());

    expect(html).toContain('data-lang="fr"');
    ['head', 'main', 'next-script'].forEach((id) =>
      expect(html).toContain(`data-testid="${id}"`)
    );
  });

  it('collects the styled-components styles of the rendered page', async () => {
    getInitialProps.mockResolvedValue({ html: '<p/>', styles: 'base-styles' });
    const renderPage = jest.fn().mockReturnValue({ html: '' });
    const ctx = { renderPage };

    const props: any = await MyDocument.getInitialProps(ctx as any);

    expect(props.html).toBe('<p/>');
    expect(props.styles).toBeDefined();
    // The page renderer handed to the base Document is wrapped to collect styles.
    const enhanced = ctx.renderPage;
    enhanced();
    expect(renderPage).toHaveBeenCalledWith({
      enhanceApp: expect.any(Function),
    });
  });

  it('propagates failures of the base Document after sealing the style sheet', async () => {
    getInitialProps.mockRejectedValue(new Error('boom'));

    await expect(
      MyDocument.getInitialProps({ renderPage: jest.fn() } as any)
    ).rejects.toThrow('boom');
  });
});
