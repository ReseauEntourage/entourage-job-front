import React from 'react';
import { H6 } from 'src/components/utils/Headings';
import { BulletList as BL, CheckList as CL } from '.';

const meta = {
  title: 'Lists',
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
      <BL>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </BL>
      <BL>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </BL>
      <BL>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </BL>
      <BL>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </BL>
    </>
  );
};

export const BulletList = {
  render: BulletListTemplate,
};

const CheckListTemplate = () => {
  return (
    <>
      <CL>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </CL>
      <CL>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </CL>
      <CL>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </CL>
      <CL>
        <H6 title="Lorem ipsum dolor sit amet" />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et
          dapibus nunc. Cras at laoreet mauris. Cras est augue, sollicitudin non
          diam ut, eleifend commodo neque.
        </p>
      </CL>
    </>
  );
};

export const CheckList = {
  render: CheckListTemplate,
};

export default meta;
