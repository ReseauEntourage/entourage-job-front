import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { FilterDropdownBox } from '../FilterDropdownBox';
import { StyledFilterDropdownPanel } from '../FiltersDropdowns/FiltersDropdowns.styles';

const renderBox = () =>
  render(
    <div>
      <button type="button">Dehors</button>
      <FilterDropdownBox dataTestId="box">
        {({ isOpen, toggle }) => (
          <>
            <button type="button" onClick={toggle}>
              Zone
            </button>
            <StyledFilterDropdownPanel $open={isOpen}>
              <span>Option</span>
            </StyledFilterDropdownPanel>
          </>
        )}
      </FilterDropdownBox>
    </div>
  );

const panel = () => screen.getByText('Option').parentElement as HTMLElement;

describe('FilterDropdownBox', () => {
  it('keeps the panel closed, but mounted, until the toggle is clicked', () => {
    renderBox();
    expect(screen.getByText('Option')).toBeInTheDocument();
    expect(panel()).toHaveStyle({ display: 'none' });
  });

  it('opens on a click on the toggle and closes on a second click', () => {
    renderBox();
    fireEvent.click(screen.getByText('Zone'));
    expect(panel()).toHaveStyle({ display: 'block' });
    fireEvent.click(screen.getByText('Zone'));
    expect(panel()).toHaveStyle({ display: 'none' });
  });

  it('stays open on a click inside the panel', () => {
    renderBox();
    fireEvent.click(screen.getByText('Zone'));
    fireEvent.click(screen.getByText('Option'));
    expect(panel()).toHaveStyle({ display: 'block' });
  });

  it('closes on a click outside', () => {
    renderBox();
    fireEvent.click(screen.getByText('Zone'));
    fireEvent.click(screen.getByText('Dehors'));
    expect(panel()).toHaveStyle({ display: 'none' });
  });

  it('closes on Escape', () => {
    renderBox();
    fireEvent.click(screen.getByText('Zone'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(panel()).toHaveStyle({ display: 'none' });
  });

  it('gives the panel its width and height limits', () => {
    renderBox();
    expect(panel()).toHaveStyle({
      minWidth: '300px',
      maxHeight: '400px',
      overflowY: 'auto',
      position: 'absolute',
    });
  });
});
