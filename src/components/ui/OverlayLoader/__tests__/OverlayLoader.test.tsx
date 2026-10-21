import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// eslint-disable-next-line import-x/no-named-as-default
import expect from 'expect';
import React from 'react';
import { OverlayLoader } from '../OverlayLoader';

describe('OverlayLoader', () => {
  it('renders a loader', () => {
    const { container } = render(<OverlayLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
