import React from 'react';
import { SvgIcon, SvgIcons } from '@/assets/icons/icons';

const meta = {
  title: 'Components/UI/Icons',
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

const IconsTemplate = () => {
  return Object.keys(SvgIcons).map((iconName, index) => (
    <div key={index} style={{ margin: '20px', display: 'inline-block' }}>
      <SvgIcon
        name={iconName as keyof typeof SvgIcons}
        width={50}
        height={50}
      />
    </div>
  ));
};

export const IconsSVG = {
  render: IconsTemplate,
};

export default meta;
