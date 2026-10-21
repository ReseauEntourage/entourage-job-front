import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { CheckBox } from '../CheckBox';

describe('CheckBox', () => {
  it('renders a labelled checkbox reflecting value', () => {
    render(
      <CheckBox id="c" name="c" title="J'accepte" onChange={jest.fn()} value />
    );
    expect(screen.getByLabelText("J'accepte")).toBeChecked();
  });

  it('is unchecked by default', () => {
    render(
      <CheckBox
        id="c"
        name="c"
        title="Option"
        value={false}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onChange with the new checked state', () => {
    const onChange = jest.fn();
    render(
      <CheckBox
        id="c"
        name="c"
        title="Option"
        value={false}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('can be disabled', () => {
    render(
      <CheckBox
        id="c"
        name="c"
        title="Option"
        value={false}
        onChange={jest.fn()}
        disabled
      />
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('renders nothing when hidden', () => {
    const { container } = render(
      <CheckBox
        id="c"
        name="c"
        title="Option"
        value={false}
        onChange={jest.fn()}
        hidden
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('does not propagate clicks to parents', () => {
    const parentClick = jest.fn();
    render(
      <div onClick={parentClick}>
        <CheckBox
          id="c"
          name="c"
          title="Option"
          value={false}
          onChange={jest.fn()}
        />
      </div>
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(parentClick).not.toHaveBeenCalled();
  });
});
