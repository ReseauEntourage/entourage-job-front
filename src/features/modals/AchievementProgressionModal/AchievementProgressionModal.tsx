import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { COLORS } from '@/src/constants/styles';
import { useIsDesktop } from '@/src/hooks/utils';
import { ACHIEVEMENT_TOOLTIP } from '../../backoffice/dashboard/DashboardAchievementProgression/achievement.icons';
import { useModalContext } from '../Modal';
import { PrettyModal } from '../PrettyModal/PrettyModal';
import { AchievementProgressionEntry, CriterionStat } from 'src/api/types';
import { LucidIcon, Text, Tooltip } from 'src/components/ui';
import { ProgressBar } from 'src/components/ui/ProgressBar/ProgressBar';
import {
  StyledCriteriaList,
  StyledCriterionHeader,
  StyledCriterionLabel,
  StyledCriterionRow,
} from './AchievementProgressionModal.styles';
import { getModalMessage } from './achievement.messages';

const MODAL_ID = 'achievement-progression-modal';

interface CriterionRowProps {
  criterion: CriterionStat;
}

const CriterionRow = ({ criterion }: CriterionRowProps) => {
  const isMet = criterion.currentValue >= criterion.threshold;
  const progressPercent = Math.min(
    (criterion.currentValue / criterion.threshold) * 100,
    100
  );

  return (
    <StyledCriterionRow>
      <StyledCriterionHeader>
        <StyledCriterionLabel>
          <Text size="small" color={isMet ? 'black' : 'darkGray'}>
            {criterion.label}
          </Text>
        </StyledCriterionLabel>
        <Text
          size="small"
          weight="semibold"
          color={isMet ? 'black' : 'darkGray'}
        >
          {criterion.isPercentage
            ? `${Math.round(criterion.currentValue)}% / ${criterion.threshold}%`
            : `${Math.round(criterion.currentValue)} / ${criterion.threshold}`}
        </Text>
      </StyledCriterionHeader>
      <ProgressBar value={progressPercent} color="primaryBlue" />
    </StyledCriterionRow>
  );
};

interface AchievementProgressionModalProps {
  entry: AchievementProgressionEntry;
  /** Key of the criterion that progressed, or null when the badge was just obtained. */
  changedCriterionKey: string | null;
}

export const AchievementProgressionModal = ({
  entry,
  changedCriterionKey,
}: AchievementProgressionModalProps) => {
  const isDesktop = useIsDesktop();
  const { onClose } = useModalContext();

  const { title, subtitle } = getModalMessage(entry, changedCriterionKey);
  const isObtained = changedCriterionKey === null && entry.hasAchievement;

  const tooltipContent = ACHIEVEMENT_TOOLTIP[entry.type];

  return (
    <PrettyModal
      id={MODAL_ID}
      size="small"
      title={title}
      icon={
        isObtained ? (
          <SvgIcon name="SuperCoachDiamond" width={48} height={48} />
        ) : (
          <LucidIcon name="Handshake" size={48} color="white" />
        )
      }
      subtitle={subtitle}
      onSubmit={onClose}
      submitBtnTxt={isObtained ? 'Super !' : "C'est noté, merci !"}
    >
      <Text weight="semibold" size="small" color="darkGray">
        Progression vers le badge "{entry.label}"{' '}
        {isDesktop && tooltipContent && (
          <Tooltip content={tooltipContent} placement="top" width={190}>
            <LucidIcon name="CircleHelp" size={16} color={COLORS.mediumGray} />
          </Tooltip>
        )}
      </Text>
      <StyledCriteriaList>
        {entry.criteria.map((criterion) => (
          <CriterionRow key={criterion.key} criterion={criterion} />
        ))}
      </StyledCriteriaList>
    </PrettyModal>
  );
};
