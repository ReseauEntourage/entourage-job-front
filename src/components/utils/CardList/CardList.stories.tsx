import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { ProfileCard } from 'src/components/utils/Cards/ProfileCard';
import { UserRoles } from 'src/constants/users';
import { store } from 'src/store/store';
import { CardList } from './CardList';
import { CardListItem } from './CardListItem';

const meta = {
  title: 'CardList',
  component: CardList,
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
} satisfies Meta<typeof CardList>;

export default meta;
type Story = StoryObj<typeof meta>;

type ProfileCardProps = React.ComponentProps<typeof ProfileCard>;

const cards: ProfileCardProps[] = new Array(4)
  .fill([
    {
      userId: uuid(),
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoles.CANDIDATE,
      userProfileNudges: [
        {
          id: 'de999805-1381-42fd-b5c1-3dbe7fc3392a',
          content: "J'ai besoin d'aide pour review mon code",
          createdAt: '2025-04-14T00:00:00.000Z',
          nudge: null,
        },
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
      isAvailable: false,
    },
  ])
  .reduce((acc, val) => [...acc, ...val], []);

const list = cards.map(
  ({
    userId,
    firstName,
    lastName,
    role,
    userProfileNudges,
    sectorOccupations,
    department,
    isAvailable,
  }) => (
    <Provider store={store}>
      <CardListItem>
        <ProfileCard
          userId={userId}
          firstName={firstName}
          lastName={lastName}
          role={role}
          department={department}
          sectorOccupations={sectorOccupations}
          userProfileNudges={userProfileNudges}
          isAvailable={isAvailable}
        />
      </CardListItem>
    </Provider>
  )
);
export const Default = {
  args: {
    list,
  },
} satisfies Story;
