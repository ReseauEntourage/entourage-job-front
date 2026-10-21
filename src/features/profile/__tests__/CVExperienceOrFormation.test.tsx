import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
// eslint-disable-next-line import-x/no-named-as-default, import-x/order
import expect from 'expect';
import { useIsDesktop } from '@/src/hooks/utils';
import { CVExperienceOrFormation } from '../CVExperienceOrFormation/CVExperienceOrFormation';

jest.mock('@/src/hooks/utils', () => ({
  ...jest.requireActual('@/src/hooks/utils'),
  useIsDesktop: jest.fn(),
}));

const mockUseIsDesktop = useIsDesktop as jest.Mock;

const base = {
  title: 'Développeur',
  structure: 'ACME',
  location: 'Paris',
  description: 'Une description',
  startDate: '2020-01-01',
  endDate: '2021-06-01',
  skills: [
    { id: 's1', name: 'React' },
    { id: 's2', name: 'Node' },
  ],
};

beforeEach(() => {
  mockUseIsDesktop.mockReturnValue(true);
});

describe('CVExperienceOrFormation card variant', () => {
  it('shows title, structure - location, dates, description and skills', () => {
    render(<CVExperienceOrFormation {...base} variant="card" />);
    expect(screen.getByText('Développeur')).toBeInTheDocument();
    expect(screen.getByText('ACME - Paris')).toBeInTheDocument();
    expect(screen.getByText(/Janvier\s2020 - Juin\s2021/)).toBeInTheDocument();
    expect(screen.getByText('Une description')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  it('omits the structure line without structure and location', () => {
    render(<CVExperienceOrFormation title="Seul" skills={[]} variant="card" />);
    expect(screen.getByText('Seul')).toBeInTheDocument();
    expect(screen.queryByText(/ACME/)).toBeNull();
  });

  it('shows only the location when there is no structure', () => {
    render(
      <CVExperienceOrFormation
        title="T"
        location="Lyon"
        skills={[]}
        variant="card"
      />
    );
    expect(screen.getByText('Lyon')).toBeInTheDocument();
  });

  it('exposes no edit tool when not editable', () => {
    render(<CVExperienceOrFormation {...base} variant="card" />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('calls editItem and deleteItem from the edit tools', () => {
    const editItem = jest.fn();
    const deleteItem = jest.fn();
    render(
      <CVExperienceOrFormation
        {...base}
        variant="card"
        isEditable
        editItem={editItem}
        deleteItem={deleteItem}
      />
    );
    const [edit, del] = screen.getAllByRole('button');
    fireEvent.click(edit);
    expect(editItem).toHaveBeenCalledTimes(1);
    fireEvent.click(del);
    expect(deleteItem).toHaveBeenCalledTimes(1);
  });

  it('does not crash when editable without callbacks', () => {
    render(<CVExperienceOrFormation {...base} variant="card" isEditable />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.getByText('Développeur')).toBeInTheDocument();
  });
});

describe('CVExperienceOrFormation summary variants', () => {
  it('summary shows title and structure only', () => {
    render(<CVExperienceOrFormation {...base} variant="summary" />);
    expect(screen.getByText('Développeur')).toBeInTheDocument();
    expect(screen.getByText('ACME')).toBeInTheDocument();
    expect(screen.queryByText('Une description')).toBeNull();
    expect(screen.queryByText('React')).toBeNull();
  });

  it('summary-detailed also shows location, description and skills', () => {
    render(<CVExperienceOrFormation {...base} variant="summary-detailed" />);
    expect(screen.getByText('ACME - Paris')).toBeInTheDocument();
    expect(screen.getByText('Une description')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('summary-detailed hides the skills block when there is none', () => {
    render(
      <CVExperienceOrFormation
        title="T"
        skills={[]}
        variant="summary-detailed"
      />
    );
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});

describe('CVExperienceOrFormation timeline variant', () => {
  it('shows the date in the side column on desktop', () => {
    render(<CVExperienceOrFormation {...base} variant="timeline" />);
    expect(screen.getByText('Développeur')).toBeInTheDocument();
    expect(screen.getByText('ACME - Paris')).toBeInTheDocument();
    expect(screen.getByText('Une description')).toBeInTheDocument();
    expect(screen.getAllByText(/2020/).length).toBeGreaterThan(0);
  });

  it('shows the date under the title on mobile', () => {
    mockUseIsDesktop.mockReturnValue(false);
    render(<CVExperienceOrFormation {...base} variant="timeline" />);
    expect(screen.getAllByText(/2020/).length).toBeGreaterThan(0);
  });

  it('shows no date when none is known', () => {
    render(
      <CVExperienceOrFormation title="T" skills={[]} variant="timeline" />
    );
    expect(screen.queryByText(/\d{4}/)).toBeNull();
  });

  it('wires edit and delete tools', () => {
    const editItem = jest.fn();
    const deleteItem = jest.fn();
    render(
      <CVExperienceOrFormation
        {...base}
        variant="timeline"
        isEditable
        editItem={editItem}
        deleteItem={deleteItem}
      />
    );
    const [edit, del] = screen.getAllByRole('button');
    fireEvent.click(edit);
    fireEvent.click(del);
    expect(editItem).toHaveBeenCalledTimes(1);
    expect(deleteItem).toHaveBeenCalledTimes(1);
  });
});
