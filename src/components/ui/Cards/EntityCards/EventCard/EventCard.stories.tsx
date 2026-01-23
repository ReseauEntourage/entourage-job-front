import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { EventMode, EventType } from '@/src/constants/events';
import { store } from 'src/store/store';
import { EventCard, EventCardProps } from './EventCard';

const Component = (props: EventCardProps) => {
  return (
    <Provider store={store}>
      <EventCard {...props} />
    </Provider>
  );
};

const meta = {
  title: 'Components/UI/Cards/EntityCards/EventCard',
  component: Component,
  argTypes: {
    salesForceId: {
      control: 'text',
      description: "ID Salesforce de l'événement",
    },
    name: {
      control: 'text',
      description: "Nom de l'événement",
    },
    startDate: {
      control: 'date',
      description: "Date et heure de début de l'événement",
    },
    eventType: {
      control: 'select',
      description: 'Type de l’événement',
      options: Object.values(EventType),
    },
    mode: {
      control: 'select',
      description: 'Mode de l’événement',
      options: Object.values(EventMode),
    },
    meetingLink: {
      control: 'text',
      if: { arg: 'mode', eq: EventMode.ONLINE },
      description: 'Lien de réunion (optionnel)',
    },
    fullAddress: {
      control: 'text',
      if: { arg: 'mode', eq: EventMode.IN_PERSON },
      description: "Adresse complète de l'événement (optionnel)",
    },
    registrationCount: {
      control: 'number',
      description: 'Nombre de participants inscrits (optionnel)',
    },
    isParticipating: {
      control: 'boolean',
      description: "Indique si l'utilisateur participe à l'événement",
    },
  },
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Irl = {
  args: {
    salesForceId: uuid(),
    name: 'Café des coachs',
    startDate: new Date().toISOString(),
    eventType: EventType.COFFEE_SESSION,
    mode: EventMode.IN_PERSON,
    fullAddress: "123 Rue de l'Exemple, 75000 Paris",
    registrationCount: 42,
    meetingLink: null,
    isParticipating: false,
  },
} satisfies Story;

export const Online = {
  args: {
    salesForceId: uuid(),
    name: 'Les Papotages Pro en ligne',
    startDate: new Date().toISOString(),
    eventType: EventType.PAPOTAGES_PRO,
    mode: EventMode.ONLINE,
    fullAddress: null,
    registrationCount: 42,
    meetingLink: 'https://example.com/meeting',
    isParticipating: false,
  },
} satisfies Story;

export const Participate = {
  args: {
    salesForceId: uuid(),
    name: 'Les Papotages Pro en ligne',
    startDate: new Date().toISOString(),
    eventType: EventType.PAPOTAGES_PRO,
    mode: EventMode.ONLINE,
    fullAddress: null,
    registrationCount: 42,
    meetingLink: 'https://example.com/meeting',
    isParticipating: true,
  },
} satisfies Story;
