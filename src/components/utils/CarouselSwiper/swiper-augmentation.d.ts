/* eslint import/no-unresolved: "off" */
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

declare module 'swiper/react' {
  interface SwiperProps {
    modules?: [Pagination, Autoplay, Navigation];
    threshold?: number;
    navigation: boolean;
    autoplay: boolean;
    pagination: {
      clickable: boolean;
    };
  }
}
