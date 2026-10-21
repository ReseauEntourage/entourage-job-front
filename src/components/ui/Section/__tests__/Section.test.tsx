import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Section } from '../Section';

describe('Section', () => {
  it('renders children in a section and a container', () => {
    const { container } = render(<Section id="s">Contenu</Section>);
    const section = container.firstElementChild as HTMLElement;
    expect(section).toHaveAttribute('id', 's');
    expect(section).toHaveClass('uk-section');
    expect(section.firstElementChild).toHaveClass('uk-container');
  });

  it('adds style, size, container size and custom classes', () => {
    const { container } = render(
      <Section
        style="muted"
        size="large"
        container="small"
        className="extra"
        preserveColor
      >
        Contenu
      </Section>
    );
    const section = container.firstElementChild as HTMLElement;
    expect(section).toHaveClass(
      'uk-section-muted',
      'uk-section-large',
      'extra',
      'uk-preserve-color'
    );
    expect(section.firstElementChild).toHaveClass('uk-container-small');
  });

  it('ignores the built-in classes for a custom section', () => {
    const { container } = render(
      <Section className="custom-hero" display="flex" style="muted">
        Contenu
      </Section>
    );
    expect(container.querySelector('.uk-section')).not.toBeInTheDocument();
    expect(container.querySelector('.section-container')).toHaveClass('flex');
  });
});
