import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { ProfileCard } from '@/src/components/ui/Cards/EntityCards/ProfileCard';
import { Genders } from '@/src/constants/genders';
import { UserRoles } from 'src/constants/users';
import { store } from 'src/store/store';
import { CardList } from './CardList';
import { CardListItem } from './CardListItem';

const meta = {
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
      gender: Genders.MALE,
      sectorOccupations: [
        {
          businessSector: { name: 'Informatique et digital' },
          occupation: { name: 'développeur' },
          order: 0,
        },
        {
          businessSector: { name: 'Bâtiment' },
          occupation: { name: 'ouvrier' },
          order: 0,
        },
      ],
      department: 'Paris (75)',
      isAvailable: false,
      hasPicture: true,
      currentJob: null,
      achievements: [],
    },
  ])
  .reduce((acc, val) => [...acc, ...val], []);

const list = cards.map(
  ({
    userId,
    firstName,
    lastName,
    role,
    sectorOccupations,
    department,
    isAvailable,
    hasPicture,
    currentJob,
    gender,
    achievements,
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
          isAvailable={isAvailable}
          hasPicture={hasPicture}
          currentJob={currentJob}
          gender={gender}
          achievements={achievements}
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
