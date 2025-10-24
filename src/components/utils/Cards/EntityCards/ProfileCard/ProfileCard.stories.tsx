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
    nudges: [
      {
        id: 'f0c6c2e7-7176-41d7-bfc7-2e4d5a543f15',
        value: 'event',
        nameRequest:
          'Se rencontrer et échanger avec les membres de la communauté',
        nameOffer:
          'Se rencontrer lors d’événements avec les membres de la communauté',
        order: 4,
      },
    ],
    isAvailable: true,
    sectorOccupations: [
      {
        id: '212e81c9-44de-43e5-b0cf-9191f2fadd63',
        businessSector: { name: 'Informatique et digital', prefixes: '' },
        occupation: { name: 'développeur' },
        order: 0,
      },
      {
        id: '6dde41d3-f6a4-4a5c-8e44-5320855b89b7',
        businessSector: { name: 'Bâtiment', prefixes: '' },
        occupation: { name: 'ouvrier' },
        order: 0,
      },
    ],
    department: 'Paris (75)',
    hasPicture: true,
  },
} satisfies Story;

export const Coach = {
  args: {
    userId: uuid(),
    firstName: 'John',
    lastName: 'Doe',
    role: UserRoles.COACH,
    isAvailable: true,
    nudges: [
      {
        id: 'f0c6c2e7-7176-41d7-bfc7-2e4d5a543f15',
        value: 'event',
        nameRequest:
          'Se rencontrer et échanger avec les membres de la communauté',
        nameOffer:
          'Se rencontrer lors d’événements avec les membres de la communauté',
        order: 4,
      },
    ],
    sectorOccupations: [
      {
        id: '664a4779-06a6-4693-98a3-551a56478ed2',
        businessSector: { name: 'Informatique et digital', prefixes: '' },
        occupation: { name: 'développeur' },
        order: 0,
      },
      {
        id: '7fbc2540-4b6c-4ee3-91c7-b8036d6f90a4',
        businessSector: { name: 'Bâtiment', prefixes: '' },
        occupation: { name: 'ouvrier' },
        order: 0,
      },
    ],
    department: 'Paris (75)',
    hasPicture: true,
  },
} satisfies Story;
