import React from 'react';

import { Table } from './Table';
import { TdDesktop, TdMobile } from './Td';
import { Th } from './Th';
import { TrDesktop, TrMobile } from './Tr';

const meta = {
  component: Table,
  parameters: {
    controls: {
      exclude: /.*/g,
    },
  },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            display: 'flex',
            padding: 8,
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

const columns = ['Column 1', 'Column 2', 'Column 3'];
const rows = [
  ['Data 1', 'Data 2', 'Data 3'],
  ['Data 1', 'Data 2', 'Data 3'],
  ['Data 1', 'Data 2', 'Data 3'],
];

const DesktopTemplate = () => (
  <Table
    columns={columns.map((col) => (
      <Th>{col}</Th>
    ))}
    body={rows.map((row) => (
      <TrDesktop>
        {row.map((data) => (
          <TdDesktop>{data}</TdDesktop>
        ))}
      </TrDesktop>
    ))}
  />
);

const MobileTemplate = () => (
  <Table
    columns={[]}
    body={rows.map((row) => (
      <TrMobile>
        <div className="line">
          <TdMobile>Data 0</TdMobile>;
        </div>
        <div className="line">
          {row.map((data, index) => (
            <TdMobile title={`Column ${index + 1}`}>{data}</TdMobile>
          ))}
        </div>
      </TrMobile>
    ))}
  />
);

export const DesktopTable = {
  render: DesktopTemplate,
};

export const MobileTable = {
  render: MobileTemplate,
};

export default meta;
