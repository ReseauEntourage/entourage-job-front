import React from 'react';
import { H6 } from '@/src/components/ui/Headings';
import { BulletListElement } from './BulletListElement';
import { CheckListElement } from './CheckListElement';
import { List } from './List';

const meta = {
  component: List,
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
  decorators: [
    (Story) => {
      return (
        <ul style={{ padding: '50px' }}>
          <Story />
        </ul>
      );
    },
  ],
};

const BulletListTemplate = () => {
  return (
    <>
      <BulletListElement>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </BulletListElement>
      <BulletListElement>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </BulletListElement>
      <BulletListElement>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </BulletListElement>
      <BulletListElement>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </BulletListElement>
    </>
  );
};

export const BulletList = {
  render: BulletListTemplate,
};

const CheckListTemplate = () => {
  return (
    <>
      <CheckListElement>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </CheckListElement>
      <CheckListElement>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </CheckListElement>
      <CheckListElement>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </CheckListElement>
      <CheckListElement>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </CheckListElement>
    </>
  );
};

export const CheckList = {
  render: CheckListTemplate,
};

export default meta;
