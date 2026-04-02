import { UserAchievement } from '@/src/api/types';
import {
  LucidIcon,
  Tag,
  TagSize,
  TagVariant,
  Tooltip,
  Text,
} from '@/src/components/ui';

interface ProfileAchievementHighlighterProps {
  achievement: UserAchievement;
}

export const ProfileAchievementHighlighter = ({
  achievement,
}: ProfileAchievementHighlighterProps) => {
  const tooltipContent = (
    // Note: Hardcoded content for now, as we only have one achievement type. We can easily make it dynamic later if we add more achievement types.
    <Text size="small">
      Ce coach répond régulièrement aux messages et soutient activement des
      candidats.
    </Text>
  );
  return (
    <Tooltip content={tooltipContent}>
      <Tag size={TagSize.Small} variant={TagVariant.LightYellow}>
        <LucidIcon name="Trophy" />
        {achievement.title}
      </Tag>
    </Tooltip>
  );
};
