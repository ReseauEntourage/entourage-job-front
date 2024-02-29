import { Meta, StoryObj } from '@storybook/react';
import { WarningStrip } from './WarningStrip';

const meta = {
    title: 'Warning Strip',
    component: WarningStrip,   
} satisfies Meta<typeof WarningStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
    args: {
        children: 'This is a warning strip',
    }
} satisfies Story;