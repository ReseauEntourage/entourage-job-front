import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CarouselItem } from '@/src/features/partials/utils/CarouselItem';
import { Carousel } from './Carousel';

const meta = {
  component: Carousel,
  render: () => {
    const slides = [
      {
        img: '/static/img/why_1.jpg',
        description: 'Diapositive 1',
      },
      {
        img: '/static/img/why_2.jpg',
        description: 'Diapositive 2',
      },
      {
        img: '/static/img/why_3.jpg',
        description: 'Diapositive 3',
      },
      {
        img: '/static/img/why_4.jpg',
        description: 'Diapositive 4',
      },
    ];
    return (
      <Carousel
        style="default"
        containerClasses="uk-container-small uk-child-width-1-1"
      >
        {slides.map(({ img, description }, index) => {
          return (
            <CarouselItem
              key={index}
              index={index}
              img={img}
              description={description}
            />
          );
        })}
      </Carousel>
    );
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {};
