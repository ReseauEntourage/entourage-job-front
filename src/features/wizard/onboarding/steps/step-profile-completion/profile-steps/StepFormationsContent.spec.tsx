jest.mock('@/src/api');

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockAddFormation = jest.fn();
jest.mock('@/src/features/profile/hooks/useEditableFormations', () => ({
  useEditableFormationsByIndex: () => ({
    addFormation: mockAddFormation,
    editFormation: jest.fn(),
    deleteFormation: jest.fn(),
  }),
}));

jest.mock(
  '@/src/features/profile/CVExperienceOrFormation/CVExperienceOrFormation',
  () => ({
    CVExperienceOrFormation: ({ title }: { title: string }) => (
      <div data-testid="item">{title}</div>
    ),
  })
);

import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import '@testing-library/jest-dom';
import type { Formation } from '@/src/api/types';
import { StepFormationsContent } from './StepFormationsContent';

const FORMATION = { id: 'e1', title: 'CAP Logistique' } as unknown as Formation;

describe('StepFormationsContent', () => {
  beforeEach(() => mockAddFormation.mockClear());

  it('shows the empty card and the skip hint when the list is empty', () => {
    render(<StepFormationsContent formations={[]} onChange={jest.fn()} />);
    expect(
      screen.getByText('Intitulé, établissement et dates.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Vous pouvez passer cette étape.')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Aucune formation/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    fireEvent.click(
      screen.getByRole('button', { name: /Ajouter une formation/ })
    );
    expect(mockAddFormation).toHaveBeenCalledTimes(1);
  });

  it('shows the inline row under the items when the list is not empty', () => {
    render(
      <StepFormationsContent formations={[FORMATION]} onChange={jest.fn()} />
    );
    expect(screen.getByTestId('item')).toBeInTheDocument();
    expect(
      screen.queryByText('Intitulé, établissement et dates.')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Vous pouvez passer cette étape.')
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Ajouter une autre formation' })
    );
    expect(mockAddFormation).toHaveBeenCalledTimes(1);
  });

  it('brings the empty card back once the last item is removed', () => {
    const { rerender } = render(
      <StepFormationsContent formations={[FORMATION]} onChange={jest.fn()} />
    );
    rerender(<StepFormationsContent formations={[]} onChange={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /Ajouter une formation/ })
    ).toBeInTheDocument();
  });

  it('shows the section title only when showSectionTitle is set', () => {
    const { rerender } = render(
      <StepFormationsContent formations={[]} onChange={jest.fn()} />
    );
    expect(screen.queryByText('Formations')).not.toBeInTheDocument();
    rerender(
      <StepFormationsContent
        formations={[]}
        onChange={jest.fn()}
        showSectionTitle
      />
    );
    expect(screen.getByText('Formations')).toBeInTheDocument();
  });

  it('hides the skip hint when the section title is shown (CV recap)', () => {
    render(
      <StepFormationsContent
        formations={[]}
        onChange={jest.fn()}
        showSectionTitle
      />
    );
    expect(
      screen.getByRole('button', { name: /Ajouter une formation/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Vous pouvez passer cette étape.')
    ).not.toBeInTheDocument();
  });
});
