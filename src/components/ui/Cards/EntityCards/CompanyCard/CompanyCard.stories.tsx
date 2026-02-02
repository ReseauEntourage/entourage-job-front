import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { UserRoles } from 'src/constants/users';
import { store } from 'src/store/store';
import { CompanyCard, CompanyCardProps } from './CompanyCard';

const Component = (props: CompanyCardProps) => {
  return (
    <Provider store={store}>
      <CompanyCard {...props} />
    </Provider>
  );
};

const meta = {
  title: 'Components/UI/Cards/EntityCards/CompanyCard',
  component: Component,
} satisfies Meta<typeof CompanyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    id: uuid(),
    name: 'Entreprise 1',
    logoUrl: 'https://picsum.photos/200',
    businessSectors: [
      { id: '1', name: 'Informatique et digital', prefixes: '' },
      { id: '2', name: 'Bâtiment', prefixes: '' },
    ],
    users: [
      {
        id: uuid(),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRoles.CANDIDATE,
        userProfile: {
          hasPicture: false,
        },
      },
    ],
  },
} satisfies Story;
