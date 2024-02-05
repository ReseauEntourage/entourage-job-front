import React from 'react';

import { StyledHelpModalSelectOption } from 'src/components/backoffice/parametres/ParametresLayout/ParametresHelpCard/ParametresHelpCard.styles';
import { Card } from 'src/components/utils/Cards/Card';
import { H6 } from 'src/components/utils/Headings';
import { ParametresHelpCardContents } from 'src/constants/helps';
import { USER_ROLES } from 'src/constants/users';
import { SelectList as SelectListComponent } from './SelectList';

const meta = {
  title: 'Select List',
  component: SelectListComponent,
  parameters: {
    controls: {
      include: ['isMulti'],
    },
  },
  argTypes: {
    isMulti: {
      control: 'boolean',
      defaultValue: true,
    },
  },
  args: {
    id: 'select-list-stories',
    onChange: () => {},
    options: ParametresHelpCardContents[USER_ROLES.CANDIDATE].map(
      ({ value, title, description, icon }) => ({
        value,
        component: (
          <StyledHelpModalSelectOption>
            <div className="img-container">
              {/* <Img src={icon} alt="" height={70} width={70} /> */}
              {icon}
            </div>
            <div className="text-container">
              <H6 title={title} color="primaryOrange" />
              <p>{description}</p>
            </div>
          </StyledHelpModalSelectOption>
        ),
      })
    ),
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            maxWidth: '600px',
          }}
        >
          <Card>
            <Story />
          </Card>
        </div>
      );
    },
  ],
};
const Template = (args) => {
  return <SelectListComponent {...args} />;
};

export const Default = {
  render: Template,
};

export default meta;
