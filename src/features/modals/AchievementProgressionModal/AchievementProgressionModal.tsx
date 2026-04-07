import React from 'react';
import { SvgIcon } from '@/assets/icons/icons';
import { useModalContext } from '../Modal';
import { PrettyModal } from '../PrettyModal/PrettyModal';
import { AchievementProgressionEntry, CriterionStat } from 'src/api/types';
import { LucidIcon, Text } from 'src/components/ui';
import { ProgressBar } from 'src/components/ui/ProgressBar/ProgressBar';
import { COLORS } from 'src/constants/styles';
import {
  StyledCriteriaList,
  StyledCriterionHeader,
  StyledCriterionLabel,
  StyledCriterionRow,
} from './AchievementProgressionModal.styles';

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
          <LucidIcon
            name={isMet ? 'CircleCheck' : 'Circle'}
            size={24}
            color={isMet ? COLORS.primaryBlue : COLORS.mediumGray}
          />
          <Text size="small" color={isMet ? 'black' : 'darkGray'}>
            {criterion.label}
          </Text>
        </StyledCriterionLabel>
        <Text
          size="small"
          weight="semibold"
          color={isMet ? 'black' : 'darkGray'}
        >
          {Math.round(criterion.currentValue)} / {criterion.threshold}
        </Text>
      </StyledCriterionHeader>
      <ProgressBar value={progressPercent} color="primaryBlue" />
    </StyledCriterionRow>
  );
};

interface AchievementProgressionModalProps {
  entry: AchievementProgressionEntry;
}

export const AchievementProgressionModal = ({
  entry,
}: AchievementProgressionModalProps) => {
  const { onClose } = useModalContext();

  const pendingCount = entry.criteria.filter(
    (c) => c.currentValue < c.threshold
  ).length;

  const title = entry.hasAchievement
    ? `Badge "${entry.label}" obtenu !`
    : 'Continue comme ça !';

  const subtitle = entry.hasAchievement
    ? 'Vous faites partie des coachs les plus engagés. Votre profil est maintenant mis en avant auprès des candidats.'
    : pendingCount > 0
    ? `Encore ${pendingCount} objectif${
        pendingCount > 1 ? 's' : ''
      } à atteindre pour décrocher le badge.`
    : 'Tu as presque atteint le badge !';

  return (
    <PrettyModal
      id={MODAL_ID}
      size="small"
      title={title}
      icon={<SvgIcon name="SuperCoachDiamond" width={48} height={48} />}
      subtitle={subtitle}
      onSubmit={onClose}
      submitBtnTxt={entry.hasAchievement ? 'Super !' : 'Continuer'}
    >
      <StyledCriteriaList>
        {entry.criteria.map((criterion) => (
          <CriterionRow key={criterion.key} criterion={criterion} />
        ))}
      </StyledCriteriaList>
    </PrettyModal>
  );
};
