import { plateform } from 'src/utils/Device';
import { MessagingDesktop } from './Messaging.desktop';
import { MessagingMobile } from './Messaging.mobile';
import { MessagingProps } from './Messaging.types';

export const Messaging: (props: MessagingProps) => JSX.Element = plateform({
  Desktop: MessagingDesktop,
  Mobile: MessagingMobile,
});
