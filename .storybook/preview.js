import UIkit from 'src/styles/dist/js/uikit';
import Icons from 'src/styles/dist/js/uikit-icons';
import * as NextImage from 'next/image';

import 'src/styles/dist/css/uikit.entourage.min.css';
import 'react-phone-number-input/style.css';

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

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export default preview;
