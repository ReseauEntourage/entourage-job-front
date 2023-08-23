import React, { FunctionComponent } from 'react';
import { SwiperRef } from 'swiper/swiper-react';

declare module 'swiper/react' {
  import {
    Swiper as OriginalSwiper,
    SwiperProps as OriginalSwiperProps,
  } from 'swiper/swiper-react.d';

  import { SwiperModule } from 'swiper/types';

  export interface SwiperProps extends OriginalSwiperProps {
    modules?: SwiperModule[];
    threshold?: number;
    navigation: boolean;
    autoplay: boolean;
    pagination: {
      clickable: boolean;
    };
  }

  export const Swiper: FunctionComponent<
    React.RefAttributes<SwiperRef> & SwiperProps
  > = OriginalSwiper;
}
