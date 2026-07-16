import { IconName, LucidIcon } from '@/src/components/ui';
import { H6 } from '@/src/components/ui/Headings';
import {
  StyledLine,
  StyledWebinarSelectGroupLabel,
} from './WebinarSelectGroupLabel.styles';

type WebinarSelectGroupLabelProps = {
  label: string;
  icon: IconName;
};

export const WebinarSelectGroupLabel = ({
  label,
  icon,
}: WebinarSelectGroupLabelProps) => {
  return (
    <StyledWebinarSelectGroupLabel>
      {icon && <LucidIcon name={icon} size={20} />}
      <H6 title={label} noMarginBottom />
      <StyledLine />
    </StyledWebinarSelectGroupLabel>
  );
};
