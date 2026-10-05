import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import '@testing-library/jest-dom';
import { openModal } from '@/src/features/modals/Modal';
import {
  isVerifiedDomain,
  LinkifiedText,
  splitTextAndLinks,
  toSafeHref,
} from './LinkifiedText';

jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));

// The component barrel (@/src/components/ui) transitively imports the
// ESM-only @react-hook/window-size (cf. useEmailConfirmationPhase.spec.tsx).
jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const renderContent = (content: string, skipExternalLinkWarning = false) =>
  render(
    <div data-testid="content">
      <LinkifiedText
        content={content}
        skipExternalLinkWarning={skipExternalLinkWarning}
      />
    </div>
  );

const hasEventHandlerAttribute = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('*')).some((element) =>
    Array.from(element.attributes).some((attribute) =>
      attribute.name.toLowerCase().startsWith('on')
    )
  );

describe('toSafeHref', () => {
  it('adds http:// to a URL without scheme', () => {
    expect(toSafeHref('www.example.com')).toBe('http://www.example.com/');
  });

  it('keeps an https URL with its query string', () => {
    expect(toSafeHref('https://example.com/?a=1&b=2')).toBe(
      'https://example.com/?a=1&b=2'
    );
  });
});

describe('splitTextAndLinks', () => {
  it('returns a single text segment when there is no URL', () => {
    expect(splitTextAndLinks('Bonjour, comment ça va ?')).toEqual([
      { type: 'text', value: 'Bonjour, comment ça va ?' },
    ]);
  });

  it('splits text around a URL', () => {
    expect(splitTextAndLinks('Voir https://example.com/offre merci')).toEqual([
      { type: 'text', value: 'Voir ' },
      {
        type: 'link',
        value: 'https://example.com/offre',
        href: 'https://example.com/offre',
      },
      { type: 'text', value: ' merci' },
    ]);
  });
});

describe('isVerifiedDomain', () => {
  const initialSafeDomains = process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS;

  afterEach(() => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = initialSafeDomains;
  });

  it('trusts the whitelisted domain and its subdomains', () => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS =
      'entourage-pro.fr, linkedin.com';

    expect(isVerifiedDomain('https://entourage-pro.fr/offres')).toBe(true);
    expect(isVerifiedDomain('https://www.entourage-pro.fr/')).toBe(true);
    expect(isVerifiedDomain('https://fr.linkedin.com/in/awa')).toBe(true);
  });

  it('does not trust a look-alike suffix', () => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = 'entourage-pro.fr';

    expect(isVerifiedDomain('https://evilentourage-pro.fr/')).toBe(false);
    expect(isVerifiedDomain('https://entourage-pro.fr.evil.com/')).toBe(false);
  });

  it('trusts nothing when the whitelist is empty or blank', () => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = '';
    expect(isVerifiedDomain('https://example.com/')).toBe(false);

    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = ' , ';
    expect(isVerifiedDomain('https://example.com/')).toBe(false);

    delete process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS;
    expect(isVerifiedDomain('https://example.com/')).toBe(false);
  });
});

describe('LinkifiedText', () => {
  const initialSafeDomains = process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = 'entourage-pro.fr';
    (openModal as jest.Mock).mockClear();
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS = initialSafeDomains;
  });

  [
    'http://example.com/"onmouseover="alert(1)',
    "voir x.com/a'onclick='alert(1)",
    'http://example.com/"><img src=x onerror=alert(1)>',
  ].forEach((content) => {
    it(`does not turn a booby-trapped URL into code: ${content}`, () => {
      const { getByTestId } = renderContent(content);

      expect(getByTestId('content')).toHaveTextContent(content);
      expect(hasEventHandlerAttribute(getByTestId('content'))).toBe(false);
      expect(getByTestId('content').querySelector('img')).toBeNull();
    });
  });

  [
    '<b>gras</b>',
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
  ].forEach((content) => {
    it(`shows HTML as plain text: ${content}`, () => {
      const { getByTestId } = renderContent(content);

      expect(getByTestId('content')).toHaveTextContent(content);
      expect(getByTestId('content').children).toHaveLength(0);
    });
  });

  it('keeps a URL with query parameters intact', () => {
    renderContent('https://example.com/?a=1&b=2');

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://example.com/?a=1&b=2'
    );
    expect(screen.getByRole('link')).toHaveTextContent(
      'https://example.com/?a=1&b=2'
    );
  });

  [
    ['www.example.com', 'http://www.example.com/'],
    ['example.fr/chemin', 'http://example.fr/chemin'],
  ].forEach(([content, href]) => {
    it(`links a URL without scheme: ${content}`, () => {
      renderContent(content);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveTextContent(content);
    });
  });

  it('keeps line breaks in the text', () => {
    const { getByTestId } = renderContent('Ligne 1\nLigne 2');

    expect(getByTestId('content').textContent).toBe('Ligne 1\nLigne 2');
  });

  it('opens the warning modal for an unverified domain', () => {
    renderContent('https://example.com');

    const notPrevented = fireEvent.click(screen.getByRole('link'));

    expect(notPrevented).toBe(false);
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('opens a verified domain directly', () => {
    renderContent('https://www.entourage-pro.fr/offres');

    const notPrevented = fireEvent.click(screen.getByRole('link'));

    expect(notPrevented).toBe(true);
    expect(openModal).not.toHaveBeenCalled();
  });

  it('skips the warning modal when asked to (message sent by an admin)', () => {
    renderContent('https://example.com', true);

    const notPrevented = fireEvent.click(screen.getByRole('link'));

    expect(notPrevented).toBe(true);
    expect(openModal).not.toHaveBeenCalled();
  });
});
