import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Background } from './Background';

describe('Background', () => {
  const child = <span>content</span>;

  it('covers its area by default', () => {
    const { container } = render(<Background blend={{}}>{child}</Background>);

    expect((container.firstChild as HTMLElement).className).toBe(
      'uk-background-cover'
    );
  });

  it('composes the position, blend mode, color and fixed classes', () => {
    const { container } = render(
      <Background
        position="center-center"
        fixed
        blend={{ mode: 'multiply' as any, color: 'primary' as any }}
      >
        {child}
      </Background>
    );

    expect((container.firstChild as HTMLElement).className).toBe(
      'uk-background-cover uk-background-center-center uk-background-blend-multiply uk-background-fixed uk-background-primary'
    );
  });

  it('uses the hex color as inline style when no UIkit color is given', () => {
    const { container } = render(
      <Background blend={{ colorHex: '#123456' }}>{child}</Background>
    );

    expect((container.firstChild as HTMLElement).style.backgroundColor).toBe(
      'rgb(18, 52, 86)'
    );
  });

  it('prefers the UIkit color over the hex color', () => {
    const { container } = render(
      <Background blend={{ color: 'primary' as any, colorHex: '#123456' }}>
        {child}
      </Background>
    );

    expect((container.firstChild as HTMLElement).style.backgroundColor).toBe(
      ''
    );
  });

  it('sets the background image from the source', () => {
    const { container } = render(
      <Background src="/static/img/x.png" blend={{}}>
        {child}
      </Background>
    );

    expect(
      (container.firstChild as HTMLElement).style.backgroundImage
    ).toContain('/static/img/x.png');
  });
});
