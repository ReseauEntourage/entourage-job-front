/* eslint-disable react/prop-types */
// Swiper ships ESM-only builds that Jest cannot parse: this stub renders the slides in a plain
// element. Tests that need to observe the Swiper props mock `swiper/react` themselves.
const React = require('react');

module.exports = {
  Swiper: ({ children }) => React.createElement('div', null, children),
  SwiperSlide: ({ children }) => React.createElement('div', null, children),
};
