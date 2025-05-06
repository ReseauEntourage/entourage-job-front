import { HeaderConnectedMainItem, NotifBadges } from '../HeaderConnected.types';
import { UserRoles } from 'src/constants/users';

export interface HeaderConnectedContentProps {
  links?: {
    [K in UserRoles]: HeaderConnectedMainItem[];
  };
  dropdown: HeaderConnectedMainItem[];
  messaging: HeaderConnectedMainItem;
  badges: NotifBadges;
  isEmpty?: boolean;
}
