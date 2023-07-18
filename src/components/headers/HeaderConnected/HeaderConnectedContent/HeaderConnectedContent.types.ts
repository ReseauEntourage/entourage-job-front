import { HeaderConnectedMainItemProps } from '../HeaderConnected.types';

export interface HeaderConnectedContentProps {
  links?: {
    admin: HeaderConnectedMainItemProps[];
    dropdown: HeaderConnectedMainItemProps[];
    candidat: HeaderConnectedMainItemProps[];
    coach: HeaderConnectedMainItemProps[];
    coach_externe: HeaderConnectedMainItemProps[];
  };
  badges?: {
    offers: number;
    note: number;
    cv: number;
    members: number;
  };
  isEmpty?: boolean;
}
