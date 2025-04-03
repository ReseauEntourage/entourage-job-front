// import React from 'react';
// import { COLORS } from 'src/constants/styles';

// import { Button } from './Button';

// const meta = {
//   title: 'Button',
//   component: Button,
//   parameters: {
//     controls: {
//       include: ['color', 'size', 'disabled'],
//     },
//   },
//   argTypes: {
//     color: {
//       control: 'select',
//       options: ['primaryBlue', 'darkGray'],
//       defaultValue: 'primaryBlue',
//     },
//     size: {
//       control: 'select',
//       options: ['large', 'small'],
//       defaultValue: 'large',
//     },
//     disabled: {
//       control: 'boolean',
//       defaultValue: false,
//     },
//   },
//   args: {
//     children: 'Button',
//   },
//   decorators: [
//     (Story, { args }) => {
//       return (
//         <div
//           style={{
//             backgroundColor:
//               args.color === 'white' ? COLORS.black : 'transparent',
//             display: 'flex',
//             padding: 8,
//           }}
//         >
//           <Story />
//         </div>
//       );
//     },
//   ],
// };

// export const Default = {
//   args: {
//     variant: 'default',
//   },
// };

// export const Primary = {
//   args: {
//     variant: 'primary',
//   },
// };
// export const CustomPrimary = {
//   args: {
//     variant: 'primary',
//     rounded: true,
//   },
// };

// export const PrimaryInverted = {
//   args: {
//     variant: 'secondary',
//     rounded: true,
//   },
// };

// export const Secondary = {
//   args: {
//     variant: 'primary',
//   },
// };
// export const CustomSecondary = {
//   args: {
//     variant: 'secondary',
//     rounded: true,
//   },
// };

// export const SecondaryInverted = {
//   args: {
//     variant: 'primary',
//     rounded: true,
//   },
// };

// export default meta;

import { Meta } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    controls: { include: ['rounded'] },
  },
  args: {
    children: 'Button',
  },
  argTypes: {
    rounded: {
      control: 'boolean',
      defaultValue: false,
    },
  },
};

export default meta;
// type Story = StoryObj<typeof Button>;

export const Default = {
  args: {
    variant: 'default',
  },
};

export const Primary = {
  args: {
    variant: 'primary',
  },
};
export const CustomPrimary = {
  args: {
    variant: 'primary',
    rounded: true,
  },
};

export const PrimaryInverted = {
  args: {
    variant: 'secondary',
    rounded: true,
  },
};

export const Secondary = {
  args: {
    variant: 'primary',
  },
};
export const CustomSecondary = {
  args: {
    variant: 'secondary',
    rounded: true,
  },
};

export const SecondaryInverted = {
  args: {
    variant: 'primary',
    rounded: true,
  },
};

export const Small = {
  args: {
    variant: 'primary',
    rounded: true,
    size: 'small',
  },
};

export const Big = {
  args: {
    variant: 'primary',
    rounded: true,
    size: 'large',
  },
};
//-----------------------------------------------

// export const Default: Story = {
//   //
// };
// export const Primary: Story = {
//   args: {
//     variant: 'primary',
//   },
// };

// export const Secondary: Story = {
//   args: {
//     variant: 'secondary',
//   },
// };
