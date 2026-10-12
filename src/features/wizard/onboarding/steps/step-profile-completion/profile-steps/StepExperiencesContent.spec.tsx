jest.mock('@/src/api');

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));

const mockAddExperience = jest.fn();
jest.mock('@/src/features/profile/hooks/useEditableExperiences', () => ({
  useEditableExperiencesByIndex: () => ({
    addExperience: mockAddExperience,
    editExperience: jest.fn(),
    deleteExperience: jest.fn(),
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
import type { Experience } from '@/src/api/types';
import { StepExperiencesContent } from './StepExperiencesContent';

const EXPERIENCE = { id: 'e1', title: 'Cariste' } as unknown as Experience;

describe('StepExperiencesContent', () => {
  beforeEach(() => mockAddExperience.mockClear());

  it('shows the empty card and the skip hint when the list is empty', () => {
    render(<StepExperiencesContent experiences={[]} onChange={jest.fn()} />);
    expect(screen.getByText('Poste, structure et dates.')).toBeInTheDocument();
    expect(
      screen.getByText('Vous pouvez passer cette étape.')
    ).toBeInTheDocument();
    expect(screen.queryByText(/Aucune expérience/)).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    fireEvent.click(
      screen.getByRole('button', { name: /Ajouter une expérience/ })
    );
    expect(mockAddExperience).toHaveBeenCalledTimes(1);
  });

  it('shows the inline row under the items when the list is not empty', () => {
    render(
      <StepExperiencesContent experiences={[EXPERIENCE]} onChange={jest.fn()} />
    );
    expect(screen.getByTestId('item')).toBeInTheDocument();
    expect(
      screen.queryByText('Poste, structure et dates.')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Vous pouvez passer cette étape.')
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Ajouter une autre expérience' })
    );
    expect(mockAddExperience).toHaveBeenCalledTimes(1);
  });

  it('brings the empty card back once the last item is removed', () => {
    const { rerender } = render(
      <StepExperiencesContent experiences={[EXPERIENCE]} onChange={jest.fn()} />
    );
    rerender(<StepExperiencesContent experiences={[]} onChange={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /Ajouter une expérience/ })
    ).toBeInTheDocument();
  });

  it('shows the section title only when showSectionTitle is set', () => {
    const { rerender } = render(
      <StepExperiencesContent experiences={[]} onChange={jest.fn()} />
    );
    expect(
      screen.queryByText('Expériences professionnelles')
    ).not.toBeInTheDocument();
    rerender(
      <StepExperiencesContent
        experiences={[]}
        onChange={jest.fn()}
        showSectionTitle
      />
    );
    expect(
      screen.getByText('Expériences professionnelles')
    ).toBeInTheDocument();
  });
});
