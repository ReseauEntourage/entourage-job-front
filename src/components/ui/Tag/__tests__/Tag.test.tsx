import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Tag, TagSize, TagVariant } from '../Tag';

describe('Tag', () => {
  it('renders its content without a remove button by default', () => {
    render(<Tag>Logistique</Tag>);
    expect(screen.getByText('Logistique')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a remove button calling removeCallback', () => {
    const removeCallback = jest.fn();
    render(
      <Tag
        removeCallback={removeCallback}
        variant={TagVariant.DarkBlue}
        size={TagSize.Small}
      >
        Logistique
      </Tag>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(removeCallback).toHaveBeenCalledTimes(1);
  });
});
