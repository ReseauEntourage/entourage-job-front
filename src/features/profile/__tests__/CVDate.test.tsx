import { render, screen } from '@testing-library/react';

import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';

import { CVDate, formatDateRange } from '../CVDate';
import { CVExperienceOrFormation } from '../CVExperienceOrFormation/CVExperienceOrFormation';

describe('formatDateRange', () => {
  it('shows start and end dates when both are known', () => {
    expect(
      formatDateRange({ startDate: '2015-09-01', endDate: '2018-06-01' })
    ).toBe('Septembre\xa02015 - Juin\xa02018');
  });

  it("shows Aujourd'hui for an ongoing item", () => {
    expect(formatDateRange({ startDate: '2023-01-01' })).toBe(
      "Janvier\xa02023 - Aujourd'hui"
    );
  });

  it('shows only the end year when only the end date is known', () => {
    expect(formatDateRange({ endDate: '2012-01-01' })).toBe('2012');
  });

  it('shows nothing when no date is known', () => {
    expect(formatDateRange({})).toBeNull();
  });

  it('uses the given separator', () => {
    expect(
      formatDateRange({ startDate: '2015-09-01', endDate: '2018-06-01' }, ' à ')
    ).toBe('Septembre\xa02015 à Juin\xa02018');
  });
});

describe('CVDate', () => {
  it('renders only the end year when only the end date is known', () => {
    const { container } = render(
      <CVDate experienceOrFormation={{ endDate: '2012-01-01' }} />
    );
    expect(container).toHaveTextContent(/^2012$/);
  });

  it('renders nothing when no date is known', () => {
    const { container } = render(<CVDate experienceOrFormation={{}} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('CVExperienceOrFormation summary variant', () => {
  it('shows only the end year for a formation with an end date only', () => {
    render(
      <CVExperienceOrFormation
        title="Baccalauréat"
        endDate="2012-01-01"
        skills={[]}
        variant="summary"
      />
    );
    expect(screen.getByText('2012')).toBeInTheDocument();
  });

  it("shows the start date and Aujourd'hui for an ongoing experience", () => {
    render(
      <CVExperienceOrFormation
        title="Développeur"
        startDate="2023-01-01"
        skills={[]}
        variant="summary"
      />
    );
    expect(screen.getByText("Janvier 2023 à Aujourd'hui")).toBeInTheDocument();
  });

  it('shows no date for a formation without any date', () => {
    render(
      <CVExperienceOrFormation
        title="Formation sans date"
        skills={[]}
        variant="summary"
      />
    );
    expect(screen.queryByText(/Aujourd'hui|\d{4}/)).not.toBeInTheDocument();
  });
});
