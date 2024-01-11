import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { USER_ROLES } from 'src/constants/users';
import { ProfileCard } from './ProfileCard';

const meta = {
  title: 'Profile Card',
  component: ProfileCard,
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '30px',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Candidate = {
  args: {
    userId: uuid(),
    firstName: 'John',
    lastName: 'Doe',
    role: USER_ROLES.CANDIDATE,
    helps: [{ name: 'network' }, { name: 'cv' }],
    businessLines: [
      { name: 'id', order: 0 },
      { name: 'bat', order: 1 },
    ],
    ambitions: [
      { name: 'développeur', order: 0 },
      { name: 'ouvrier', order: 1 },
    ],
    department: 'Paris (75)',
  },
} satisfies Story;

export const Coach = {
  args: {
    userId: uuid(),
    firstName: 'John',
    lastName: 'Doe',
    role: USER_ROLES.COACH,
    helps: [
      { name: 'network' },
      { name: 'cv' },
      { name: 'tips' },
      { name: 'interview' },
      { name: 'event' },
    ],
    businessLines: [
      { name: 'id', order: 0 },
      { name: 'bat', order: 1 },
      { name: 'aa', order: 2 },
    ],
    job: 'Développeur',
    department: 'Paris (75)',
  },
} satisfies Story;
