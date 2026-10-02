import { UserRoles } from '@/src/constants/users';
import { NavConnectedMainItem, NotifBadges } from '../NavConnected.types';

export interface NavConnectedContentProps {
  links?: {
    [K in UserRoles]: NavConnectedMainItem[];
  };
  administration?: NavConnectedMainItem | null;
  dropdown: NavConnectedMainItem[];
  messaging: NavConnectedMainItem;
  badges: NotifBadges;
  isEmpty?: boolean;
}
