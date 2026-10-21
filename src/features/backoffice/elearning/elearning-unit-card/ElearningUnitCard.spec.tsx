import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { openModal } from '@/src/features/modals/Modal';
import { ElearningUnit } from '../elearning.types';
import { ElearningUnitCard } from './ElearningUnitCard';

jest.mock('@react-hook/window-size', () => ({
  useWindowWidth: () => 1280,
  useWindowSize: () => [1280, 800],
}));
jest.mock('@/src/features/modals/Modal', () => ({
  openModal: jest.fn(),
  useModalContext: () => ({}),
}));
jest.mock('../elearning-unit-modal/ElearningUnitModal', () => ({
  ElearningUnitModal: () => null,
}));

const unit = (completed: boolean): ElearningUnit =>
  ({
    id: 'u1',
    title: 'Poser un cadre',
    description: 'Les bases de la relation',
    durationMinutes: 12,
    questions: [],
    roles: [],
    userCompletions: completed ? [{ id: 'c' }] : [],
  }) as unknown as ElearningUnit;

describe('ElearningUnitCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('presents the unit with its duration', () => {
    render(<ElearningUnitCard elearningUnit={unit(false)} />);
    expect(screen.getByText('Poser un cadre')).toBeInTheDocument();
    expect(screen.getByText('Les bases de la relation')).toBeInTheDocument();
    expect(screen.getByText(/12 minutes/)).toBeInTheDocument();
  });

  it('offers to start an unfinished unit and opens the unit modal', () => {
    render(<ElearningUnitCard elearningUnit={unit(false)} />);
    fireEvent.click(screen.getByText('Démarrer'));
    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it('offers to review a completed unit', () => {
    render(<ElearningUnitCard elearningUnit={unit(true)} />);
    expect(screen.getByText('Revoir')).toBeInTheDocument();
    expect(screen.queryByText('Démarrer')).toBeNull();
  });

  it('numbers the unit from 1 when an index is given', () => {
    render(<ElearningUnitCard elearningUnit={unit(false)} idx={2} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows no number without index', () => {
    render(<ElearningUnitCard elearningUnit={unit(false)} />);
    expect(screen.queryByText('1')).toBeNull();
  });
});
