import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { UserRoles } from '@/src/constants/users';
import { WizardCompatibleProfileCard } from './WizardCompatibleProfileCard';

const baseProfile = {
  id: 'profile-1',
  firstName: 'Jeanne',
  lastName: 'Dupont',
  role: UserRoles.COACH,
  isAvailable: true,
  hasPicture: false,
  currentJob: 'Développeuse',
  sectorOccupations: [
    {
      id: 'so-1',
      businessSector: { name: 'Informatique et digital', prefixes: '' },
      occupation: { name: 'Développeur' },
      order: 0,
    },
    {
      id: 'so-2',
      businessSector: { name: 'Bâtiment', prefixes: '' },
      occupation: undefined,
      order: 1,
    },
  ],
  nudges: [
    {
      id: 'n-1',
      value: 'cv',
      nameRequest: 'Refaire son CV',
      nameOffer: 'Aide au CV',
      order: 0,
    },
    {
      id: 'n-2',
      value: 'interview',
      nameRequest: 'Préparer un entretien',
      nameOffer: 'Coaching entretien',
      order: 1,
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      title: 'Développeuse frontend',
      startDate: '2020-01-01',
      endDate: '2022-06-01',
      company: 'Acme Corp',
      location: 'Paris',
      skills: [],
    },
    {
      id: 'exp-2',
      title: 'Développeuse backend',
      startDate: '2022-07-01',
      endDate: undefined,
      company: 'Beta Inc',
      location: 'Lyon',
      skills: [],
    },
  ],
  formations: [
    {
      id: 'form-1',
      title: 'Master informatique',
      startDate: '2017-09-01',
      endDate: '2019-06-01',
      institution: 'Université Paris',
      location: 'Paris',
      skills: [],
    },
  ],
} as any;

const meta = {
  title: 'Verify/WizardCompatibleProfileCard',
  component: WizardCompatibleProfileCard,
} satisfies Meta<typeof WizardCompatibleProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact = {
  args: {
    profile: baseProfile,
    variant: 'compact',
    subtitleContext: 'sectors',
    locked: true,
  },
} satisfies Story;

export const Full = {
  args: {
    profile: baseProfile,
    variant: 'full',
    badgeLabel: 'Meilleur coach pour démarrer',
  },
} satisfies Story;
