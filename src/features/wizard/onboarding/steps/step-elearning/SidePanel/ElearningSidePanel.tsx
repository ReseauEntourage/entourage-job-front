import { SidePanel } from '@/src/components/ui/SidePanel';
import { ElearningUnitVideo } from '@/src/features/backoffice/elearning/elearning-unit/ElearningUnitVideo';
import { ElearningUnit } from '@/src/features/backoffice/elearning/elearning.types';
import { WizardRecommendationsSidePanel } from '@/src/features/wizard/sidepanels/WizardRecommendationsSidePanel';
import { ElearningStepPhase } from '../Content/Content';

interface ElearningSidePanelProps {
  phase: ElearningStepPhase;
  currentUnit: ElearningUnit | undefined;
  isDesktop: boolean;
}

export const ElearningSidePanel = ({
  phase,
  currentUnit,
  isDesktop,
}: ElearningSidePanelProps) => {
  if (phase !== 'module' || !currentUnit || !isDesktop) {
    return <WizardRecommendationsSidePanel />;
  }

  return (
    <SidePanel title="Formation - Vidéo">
      <ElearningUnitVideo
        title={currentUnit.title}
        videoUrl={currentUnit.videoUrl}
      />
    </SidePanel>
  );
};
