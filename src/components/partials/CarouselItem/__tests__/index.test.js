import { render } from '@testing-library/react';
import React from 'react';
import { CarouselItem } from '..';
import '@testing-library/jest-dom';
import { BREAKPOINTS } from 'src/constants/styles';

jest.mock('@react-hook/window-size', () => {
  return jest.fn(() => {
    return {
      useWindowWidth: BREAKPOINTS.desktop,
    };
  });
});

describe('Carousel Item', () => {
  it('renders the Carousel item', () => {
    const defaultProps = {
      index: 1,
      img: '',
      description: <div />,
    };
    const { container } = render(<CarouselItem {...defaultProps} />);
    expect(container).toBeDefined();
    expect(container).toMatchSnapshot();
  });
});
