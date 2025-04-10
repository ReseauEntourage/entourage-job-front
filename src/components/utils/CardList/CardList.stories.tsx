import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { ProfileCard } from 'src/components/utils/Cards/ProfileCard';
import { USER_ROLES } from 'src/constants/users';
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
      role: USER_ROLES.CANDIDATE,
      helps: [{ name: 'network' }, { name: 'cv' }],
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
    helps,
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
          helps={helps}
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
