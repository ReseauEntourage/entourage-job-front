import React from 'react';
import { CarouselSwiper as CS } from './CarouselSwiper';

const meta = {
    title: 'Carousel Swiper',
    decorators: [
        (Story) => {
            return (
                <div>
                    <Story />
                </div>
            )
        }
    ]
}

const Slide = ({children}) => {
    return (
        <div
            style={{
                width: '100%',
                textAlign: 'center',
                padding: '20px',
                boxSizing: 'border-box',
            }}
        >
            {children}
        </div>
    )
}

const slides = [
    <Slide>
        This is the first slide
    </Slide>,
    <Slide>
        This is the second slide
    </Slide>,
    <Slide>
        This is the third slide
    </Slide>,
]

const CarouselSwiperTemplate = (args) => {
    return (
        <div
            style={{
                height: '200px',
                width: '600px',
                padding: '20px',   
                backgroundColor: 'lightgray', 
            }}
        >
            <CS {...args} slides={slides} backgroundColor={'white'}/>
        </div>
    )
}

export const CarouselSwiper = {
    render: CarouselSwiperTemplate,
};

export default meta;


