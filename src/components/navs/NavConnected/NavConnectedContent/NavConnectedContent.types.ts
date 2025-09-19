import { NavConnectedMainItem, NotifBadges } from '../NavConnected.types';
import { UserRoles } from 'src/constants/users';

export interface NavConnectedContentProps {
  links?: {
    [K in UserRoles]: NavConnectedMainItem[];
  };
  dropdown: NavConnectedMainItem[];
  messaging: NavConnectedMainItem;
  badges: NotifBadges;
  isEmpty?: boolean;
}
