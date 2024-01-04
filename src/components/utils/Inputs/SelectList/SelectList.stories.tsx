import React from 'react';

import { StyledHelpModalSelectOption } from 'src/components/backoffice/parametres/ParametresLayout/ParametresHelpCard/ParametresHelpCard.styles';
import { PARAMETRES_HELP_CARD_CONTENTS } from 'src/components/backoffice/parametres/ParametresLayout/ParametresHelpCard/ParametresHelpCard.utils';
import { Card } from 'src/components/utils/Card';
import { H6 } from 'src/components/utils/Headings';
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
    options: PARAMETRES_HELP_CARD_CONTENTS.candidat.map(
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
