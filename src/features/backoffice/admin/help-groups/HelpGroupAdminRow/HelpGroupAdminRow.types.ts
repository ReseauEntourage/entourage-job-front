import { HelpGroupAdminAction, HelpGroupAdminItem } from '@/src/api/types';

export interface HelpGroupAdminRowProps {
  group: HelpGroupAdminItem;
  onAction: (group: HelpGroupAdminItem, action: HelpGroupAdminAction) => void;
}
