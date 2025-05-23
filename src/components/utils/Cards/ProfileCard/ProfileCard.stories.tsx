import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { UserRoles } from 'src/constants/users';
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
    role: UserRoles.CANDIDATE,
    helps: [{ name: 'network' }, { name: 'cv' }],
    isAvailable: true,
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
    role: UserRoles.COACH,
    isAvailable: true,
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
