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
    userProfileNudges: [
      {
        id: '181a0e77-8e5f-4d02-ab1d-900f70d8e2ff',
        content: null,
        createdAt: '2025-04-14T00:00:00.000Z',
        nudge: {
          id: 'f0c6c2e7-7176-41d7-bfc7-2e4d5a543f15',
          value: 'event',
          nameRequest:
            'Se rencontrer et échanger avec les membres de la communauté',
          nameOffer:
            'Se rencontrer lors d’événements avec les membres de la communauté',
          order: 4,
        },
      },
    ],
    isAvailable: true,
    sectorOccupations: [
      {
        businessSector: { name: 'Informatique et digital' },
        occupation: { name: 'développeur', prefix: 'comme' },
        order: 0,
      },
      {
        businessSector: { name: 'Bâtiment' },
        occupation: { name: 'ouvrier', prefix: 'comme' },
        order: 0,
      },
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
    userProfileNudges: [
      {
        id: '181a0e77-8e5f-4d02-ab1d-900f70d8e2ff',
        content: null,
        createdAt: '2025-04-14T00:00:00.000Z',
        nudge: {
          id: 'f0c6c2e7-7176-41d7-bfc7-2e4d5a543f15',
          value: 'event',
          nameRequest:
            'Se rencontrer et échanger avec les membres de la communauté',
          nameOffer:
            'Se rencontrer lors d’événements avec les membres de la communauté',
          order: 4,
        },
      },
    ],
    sectorOccupations: [
      {
        businessSector: { name: 'Informatique et digital' },
        occupation: { name: 'développeur', prefix: 'comme' },
        order: 0,
      },
      {
        businessSector: { name: 'Bâtiment' },
        occupation: { name: 'ouvrier', prefix: 'comme' },
        order: 0,
      },
    ],
    department: 'Paris (75)',
  },
} satisfies Story;
