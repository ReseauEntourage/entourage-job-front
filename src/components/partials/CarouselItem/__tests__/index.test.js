import { render } from '@testing-library/react';
import React from 'react';
import { CarouselItem } from '..';
import '@testing-library/jest-dom';

describe('Carousel Item', () => {
  it('renders the Carousel item', () => {
    const defautProps = {
      index: 1,
      img: '',
      description: <div />,
    };
    const { container } = render(<CarouselItem {...defautProps} />);
    expect(container).toBeDefined();
    expect(container).toMatchSnapshot();
  });
});
