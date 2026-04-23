import { useMemo } from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { UserAchievement } from '@/src/api/types';
import { Tag, TagSize, TagVariant, Tooltip, Text } from '@/src/components/ui';
import { Genders } from '@/src/constants/genders';
import { useIsMobile } from '@/src/hooks/utils';

interface ProfileAchievementHighlighterProps {
  achievement: UserAchievement;
  gender: Genders;
}

export const ProfileAchievementHighlighter = ({
  achievement,
  gender,
}: ProfileAchievementHighlighterProps) => {
  const isMobile = useIsMobile();
  const tooltipContent = (
    // Note: Hardcoded content for now, as we only have one achievement type. We can easily make it dynamic later if we add more achievement types.
    <Text size="small">
      Ce coach répond régulièrement aux messages et soutient activement des
      candidats.
    </Text>
  );

  const achievementIcon = (
    <SvgIcon name="SuperCoachDiamond" width={17} height={17} />
  );

  const achievementTitle = useMemo(() => {
    switch (achievement.achievementType) {
      case 'super_engaged_coach':
        if (gender === Genders.FEMALE) {
          return 'Super engagée';
        }
        return 'Super engagé';
      default:
        return achievement.title;
    }
  }, [achievement.achievementType, achievement.title, gender]);

  return (
    <Tooltip
      content={tooltipContent}
      placement="bottom"
      width={isMobile ? 200 : undefined}
    >
      <Tag size={TagSize.Small} variant={TagVariant.DarkBlue}>
        {achievementIcon}
        {achievementTitle}
      </Tag>
    </Tooltip>
  );
};
