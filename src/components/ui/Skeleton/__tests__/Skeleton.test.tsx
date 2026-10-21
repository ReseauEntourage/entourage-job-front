import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { Dot } from '../../Dot/Dot';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import { Spinner } from '../../Spinner/Spinner';
import { Skeleton } from '../Skeleton';

describe('Skeleton', () => {
  it('renders one placeholder by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.children).toHaveLength(1);
  });

  it('renders as many placeholders as count', () => {
    const { container } = render(<Skeleton count={4} height="10px" inverted />);
    expect(container.children).toHaveLength(4);
  });
});

describe('Spinner', () => {
  it('renders a loader', () => {
    const { container } = render(<Spinner size={20} color="red" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('Dot', () => {
  it('renders a dot', () => {
    const { container } = render(<Dot color="primaryBlue" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('ProgressBar', () => {
  it('renders a bar filled to the given percentage', () => {
    const { container } = render(
      <ProgressBar value={40} color="primaryBlue" />
    );
    expect(container.querySelectorAll('div').length).toBeGreaterThanOrEqual(2);
  });
});
