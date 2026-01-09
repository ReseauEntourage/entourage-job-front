import React from 'react';
import { Partners } from './Partners';
import { PartnersSupportUs } from './PartnersSupportUs/PartnersSupportUs';
import { PartnersWorkingWithUs } from './PartnersWorkingWithUs/PartnersWorkingWithUs';

const meta = {
  title: 'Partials',
  component: Partners,
  decorators: [
    (Story) => {
      return (
        <div>
          <Story />
        </div>
      );
    },
  ],
};

const Template = () => {
  return (
    <>
      <PartnersWorkingWithUs />
      <PartnersSupportUs />
    </>
  );
};

export const PartialPartners = {
  render: Template,
};

export default meta;
