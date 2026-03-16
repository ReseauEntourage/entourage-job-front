import { Meta, StoryObj } from '@storybook/react';
import { Badge, BadgeVariant } from './Badge';

const meta = {
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: Object.values(BadgeVariant),
    },
    children: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary = {
  args: {
    variant: BadgeVariant.Primary,
    children: 'Coach',
  },
} satisfies Story;

export const TealWithIcon = {
  args: {
    variant: BadgeVariant.ExtraLightTeal,
    children: 'Correspond à vos besoins',
  },
} satisfies Story;

export const PurpleWithIcon = {
  args: {
    variant: BadgeVariant.ExtraLightPurple,
    children: 'Profil complémentaire',
  },
} satisfies Story;

export const MediumGreenWithIcon = {
  args: {
    variant: BadgeVariant.ExtraLightGreen,
    children: 'Très réactif(ve)',
  },
} satisfies Story;

export const AmberWithIcon = {
  args: {
    variant: BadgeVariant.ExtraLightAmber,
    children: 'Proche de vous',
  },
} satisfies Story;
