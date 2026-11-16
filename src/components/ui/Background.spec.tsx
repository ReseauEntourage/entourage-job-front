import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Background } from './Background';

describe('Background', () => {
  const child = <span>content</span>;
  const root = (container: HTMLElement) => container.firstChild as HTMLElement;

  it('covers its area by default', () => {
    const { container } = render(<Background>{child}</Background>);

    expect(root(container)).toHaveStyle({
      backgroundSize: 'cover',
      backgroundPosition: '50% 50%',
      backgroundRepeat: 'no-repeat',
    });
  });

  it('applies the position, the blend mode, the color and the fixed attachment', () => {
    const { container } = render(
      <Background
        position="top-right"
        fixed
        blend={{ mode: 'multiply', color: 'primary' }}
      >
        {child}
      </Background>
    );

    expect(root(container)).toHaveStyle({
      backgroundPosition: '100% 0',
      backgroundBlendMode: 'multiply',
      backgroundAttachment: 'fixed',
      backgroundColor: 'rgb(71, 168, 185)',
    });
  });

  it('uses the hex color as inline style when no named color is given', () => {
    const { container } = render(
      <Background blend={{ colorHex: '#123456' }}>{child}</Background>
    );

    expect(root(container).style.backgroundColor).toBe('rgb(18, 52, 86)');
  });

  it('prefers the named color over the hex color', () => {
    const { container } = render(
      <Background blend={{ color: 'primary', colorHex: '#123456' }}>
        {child}
      </Background>
    );

    expect(root(container).style.backgroundColor).toBe('');
    expect(root(container)).toHaveStyle({
      backgroundColor: 'rgb(71, 168, 185)',
    });
  });

  it('sets the background image from the source', () => {
    const { container } = render(
      <Background src="/static/img/x.png">{child}</Background>
    );

    expect(root(container).style.backgroundImage).toContain(
      '/static/img/x.png'
    );
  });
});
