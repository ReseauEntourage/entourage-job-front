import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Section } from '../Section';

const sectionOf = (container: HTMLElement) =>
  container.firstElementChild as HTMLElement;
const columnOf = (container: HTMLElement) =>
  sectionOf(container).firstElementChild as HTMLElement;

describe('Section', () => {
  it('renders its children in a centered column, in a padded section', () => {
    const { container, getByText } = render(<Section id="s">Contenu</Section>);
    const section = sectionOf(container);

    expect(section).toHaveAttribute('id', 's');
    expect(section).toHaveStyle({
      paddingTop: '40px',
      paddingBottom: '40px',
    });
    expect(columnOf(container)).toContainElement(getByText('Contenu'));
    expect(columnOf(container)).toHaveStyle({
      maxWidth: '1200px',
      paddingLeft: '15px',
      marginLeft: 'auto',
    });
  });

  (
    [
      ['default', 'rgb(255, 255, 255)'],
      ['muted', 'rgb(236, 248, 251)'],
      ['primary', 'rgb(71, 168, 185)'],
      ['secondary', 'rgb(34, 34, 34)'],
    ] as const
  ).forEach(([style, background]) => {
    it(`paints the ${style} style`, () => {
      const { container } = render(<Section style={style}>Contenu</Section>);
      expect(sectionOf(container)).toHaveStyle({ background });
    });
  });

  it('lights the text of the dark styles', () => {
    const { container } = render(<Section style="primary">Contenu</Section>);
    expect(sectionOf(container)).toHaveStyle({
      color: 'rgba(255, 255, 255, 0.7)',
    });
  });

  (
    [
      ['xsmall', '20px'],
      ['small', '40px'],
      ['large', '70px'],
      ['xlarge', '140px'],
    ] as const
  ).forEach(([size, padding]) => {
    it(`pads a ${size} section by ${padding}`, () => {
      const { container } = render(<Section size={size}>Contenu</Section>);
      expect(sectionOf(container)).toHaveStyle({
        paddingTop: padding,
        paddingBottom: padding,
      });
    });
  });

  (
    [
      ['small', '900px'],
      ['large', '1400px'],
    ] as const
  ).forEach(([size, maxWidth]) => {
    it(`caps the column at ${maxWidth} for a ${size} container`, () => {
      const { container } = render(<Section container={size}>Contenu</Section>);
      expect(columnOf(container)).toHaveStyle({ maxWidth });
    });
  });

  it('centers the text on demand and keeps the class name', () => {
    const { container } = render(
      <Section textCenter className="extra">
        Contenu
      </Section>
    );
    expect(sectionOf(container)).toHaveStyle({ textAlign: 'center' });
    expect(sectionOf(container)).toHaveClass('extra');
  });

  it('renders a custom section with its own container and display', () => {
    const { container } = render(
      <Section className="custom-hero" display="flex" style="muted">
        Contenu
      </Section>
    );
    expect(sectionOf(container).tagName).toBe('SECTION');
    expect(container.querySelector('.section-container')).toHaveClass('flex');
    expect(sectionOf(container)).not.toHaveStyle({ paddingTop: '40px' });
  });
});
