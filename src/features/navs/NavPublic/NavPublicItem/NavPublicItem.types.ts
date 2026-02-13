import { INavPublicItem } from '../NavPublic.types';

export interface NavPublicItemProps {
  item: INavPublicItem;
  onClick?: () => void;
}
