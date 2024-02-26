import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { ProfileCard } from 'src/components/utils/Cards/ProfileCard';
import { USER_ROLES } from 'src/constants/users';
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
      businessLines: [
        { name: 'id', order: 0 },
        { name: 'bat', order: 1 },
      ],
      ambitions: [
        { name: 'développeur', order: 0 },
        { name: 'ouvrier', order: 1 },
      ],
      department: 'Paris (75)',
      isAvailable: false,
    },
    {
      userId: uuid(),
      firstName: 'John',
      lastName: 'Doe',
      role: USER_ROLES.CANDIDATE_EXTERNAL,
      helps: [{ name: 'network' }, { name: 'cv' }],
      businessLines: [
        { name: 'id', order: 0 },
        { name: 'bat', order: 1 },
      ],
      ambitions: [{ name: 'développeur', order: 0 }],
      department: 'Paris (75)',
      isAvailable: true,
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
    businessLines,
    ambitions,
    department,
    isAvailable,
  }) => (
    <CardListItem>
      <ProfileCard
        userId={userId}
        firstName={firstName}
        lastName={lastName}
        role={role}
        department={department}
        businessLines={businessLines}
        helps={helps}
        ambitions={ambitions}
        isAvailable={isAvailable}
      />
    </CardListItem>
  )
);
export const Default = {
  args: {
    list,
  },
} satisfies Story;
