import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { USER_ROLES } from 'src/constants/users';
import { store } from 'src/store/store';
import { ProfileCard, ProfileCardProps } from '.';

const Component = (props: ProfileCardProps) => {
  return (
    <Provider store={store}>
      <ProfileCard {...props} />
    </Provider>
  );
};

const meta = {
  title: 'Profile Card',
  component: Component,
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
    isAvailable: true,
    businessSectors: [
      { name: 'id', order: 0 },
      { name: 'bat', order: 1 },
    ],
    occupations: [
      { name: 'développeur', order: 0, prefix: 'comme' },
      { name: 'ouvrier', order: 1, prefix: 'comme' },
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
    isAvailable: true,
    helps: [
      { name: 'network' },
      { name: 'cv' },
      { name: 'tips' },
      { name: 'interview' },
      { name: 'event' },
    ],
    businessSectors: [
      { name: 'id', order: 0 },
      { name: 'bat', order: 1 },
      { name: 'aa', order: 2 },
    ],
    job: 'Développeur',
    department: 'Paris (75)',
  },
} satisfies Story;
