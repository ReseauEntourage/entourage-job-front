import UIkit from 'src/styles/dist/js/uikit';
import Icons from 'src/styles/dist/js/uikit-icons';

import 'src/styles/dist/css/uikit.entourage.min.css';
import 'react-phone-number-input/style.css';
import React from "react";

UIkit.use(Icons);

const preview = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export default preview;
