import { SidePanel } from '@/src/components/ui/SidePanel';
import { ElearningUnitVideo } from '@/src/features/backoffice/elearning/elearning-unit/ElearningUnitVideo';
import { ElearningUnit } from '@/src/features/backoffice/elearning/elearning.types';
import { WizardRecommendationsSidePanel } from '@/src/features/wizard/sidepanels/WizardRecommendationsSidePanel';

interface ElearningSidePanelProps {
  currentUnit: ElearningUnit | undefined;
  isDesktop: boolean;
  onVideoPlay: () => void;
  currentUnitPosition: number;
  totalUnits: number;
}

export const ElearningSidePanel = ({
  currentUnit,
  isDesktop,
  onVideoPlay,
  currentUnitPosition,
  totalUnits,
}: ElearningSidePanelProps) => {
  if (!currentUnit || !isDesktop) {
    return <WizardRecommendationsSidePanel />;
  }

  return (
    <SidePanel
      variant="white"
      title={`Formation - Vidéo ${currentUnitPosition}/${totalUnits}`}
    >
      <ElearningUnitVideo
        title={currentUnit.title}
        videoUrl={currentUnit.videoUrl}
        onPlay={onVideoPlay}
      />
    </SidePanel>
  );
};
