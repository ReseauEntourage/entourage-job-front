import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SearchBar, SearchBarProps } from './SearchBar';

const SearchBarConfigured = ({ placeholder, light }: SearchBarProps) => {
  const [search] = useState('');
  return (
    <SearchBar
      filtersConstants={[]}
      filters={{}}
      resetFilters={() => {}}
      search={search}
      setSearch={() => {}}
      setFilters={() => {}}
      placeholder={placeholder}
      smallSelectors
      light={light}
    />
  );
};

const meta = {
  title: 'SearchBar',
  render: SearchBarConfigured,
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
  args: {
    placeholder: 'Rechercher...',
    light: false,
  },
};
