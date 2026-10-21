import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { DocumentItem } from '../DocumentItem';

jest.mock('@/src/hooks/utils', () => ({
  useIsDesktop: () => true,
}));

describe('DocumentItem', () => {
  it('opens the document when the name or the icon is clicked', () => {
    const onClick = jest.fn();
    render(
      <DocumentItem
        name="cv.pdf"
        icon={<i data-testid="icon" />}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByText('cv.pdf'));
    fireEvent.click(screen.getByTestId('icon'));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('shows a remove button only with onRemove', () => {
    const onRemove = jest.fn();
    const { rerender } = render(
      <DocumentItem name="cv.pdf" icon={<i />} onClick={jest.fn()} />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <DocumentItem
        name="cv.pdf"
        icon={<i />}
        onClick={jest.fn()}
        onRemove={onRemove}
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
