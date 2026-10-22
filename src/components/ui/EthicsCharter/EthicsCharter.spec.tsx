import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { EthicsCharter, getEthicsCharterSummaries } from './EthicsCharter';

describe('EthicsCharter', () => {
  it('renders the page variant with a main title and the last update date', () => {
    render(<EthicsCharter variant="page" />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Charte éthique' })
    ).toBeInTheDocument();
    expect(screen.getByText(/^Mise à jour le /)).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(
      5
    );
  });

  it('renders the compact variant without page headings nor update date', () => {
    render(<EthicsCharter />);

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(screen.queryByText(/^Mise à jour le /)).not.toBeInTheDocument();
    expect(screen.getByText('Discussions et échanges')).toBeInTheDocument();
  });

  it('renders **bold** markers as strong text and line breaks', () => {
    const { container } = render(<EthicsCharter variant="page" />);

    expect(
      screen.getAllByText('réseau professionnel solidaire')[0].tagName
    ).toBe('STRONG');
    expect(container.querySelectorAll('br').length).toBeGreaterThan(0);
    expect(container).not.toHaveTextContent('**');
  });

  it('lists the forbidden behaviours as bullet points followed by their consequences', () => {
    render(<EthicsCharter variant="page" />);

    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
    expect(
      screen.getByText(/Ces comportements sont incompatibles/)
    ).toBeInTheDocument();
  });

  it('renders the list items in the compact variant too', () => {
    render(<EthicsCharter variant="compact" />);

    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(6);
  });
});

describe('getEthicsCharterSummaries', () => {
  it('returns the summaries of the sections that have one, in their reading order', () => {
    const summaries = getEthicsCharterSummaries();

    expect(summaries.map((s) => s.order)).toEqual([1, 2, 3, 4, 5]);
    expect(summaries[0].title).toBe('Le respect avant tout');
    expect(summaries[4].title).toBe('Comportements interdits');
    summaries.forEach((s) => expect(s.points.length).toBeGreaterThan(0));
  });
});
