import { FilterConstant } from './utils';

export enum ContactTypeEnum {
  REMOTE = 'remote',
  PHYSICAL = 'physical',
}

export type ContactType = {
  value: ContactTypeEnum;
  label: string;
  key: string;
};

export const allContactTypes: (FilterConstant<ContactTypeEnum> & {
  key: string;
})[] = [
  {
    value: ContactTypeEnum.REMOTE,
    label: 'Contact à distance',
    key: 'allowRemoteEvents',
  },
  {
    value: ContactTypeEnum.PHYSICAL,
    label: 'Contact en présentiel',
    key: 'allowPhysicalEvents',
  },
];
