import { HeaderConnectedMainItem, NotifBadges } from '../HeaderConnected.types';
import { UserRole } from 'src/constants/users';

export interface HeaderConnectedContentProps {
  links?: {
    [K in UserRole]: HeaderConnectedMainItem[];
  };
  dropdown: HeaderConnectedMainItem[];
  messaging: HeaderConnectedMainItem;
  badges: NotifBadges;
  isEmpty?: boolean;
}
