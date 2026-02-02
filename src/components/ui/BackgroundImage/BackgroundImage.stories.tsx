import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BackgroundImage, BackgroundImageProps } from './BackgroundImage';

const meta = {
  render: ({ img, imgMobile, alt }: BackgroundImageProps) => {
    return (
      <BackgroundImage img={img} imgMobile={imgMobile} alt={alt}>
        <p>Image</p>
      </BackgroundImage>
    );
  },
} satisfies Meta<typeof BackgroundImage>;

export default meta;
type Story = StoryObj<typeof BackgroundImage>;

export const Default: Story = {
  args: {
    img: '/static/img/home-banner.jpg',
    imgMobile: '/static/img/home-banner.jpg',
    alt: 'Entourage Pro réseau solidaire professionnel',
  },
};
