import React from 'react';
import {
  StyledWizardProgressBar,
  StyledWizardStep,
  StyledWizardStepBadge,
  StyledWizardStepConnector,
  StyledWizardStepDuration,
  StyledWizardStepText,
  StyledWizardStepTitle,
} from './WizardProgressBar.styles';
import { WizardSection, WizardSectionId, WizardStep } from './wizard.types';

interface WizardProgressBarProps {
  steps: WizardStep[];
  currentIdx: number;
  sections?: WizardSection[];
  /**
   * Sections the user chose to skip (e.g. "Je le remplis plus tard" on the
   * profile step): once behind the current step, they get the "skipped"
   * state instead of the "completed" one.
   */
  skippedSectionIds?: WizardSectionId[];
}

export const WizardProgressBar = ({
  steps,
  currentIdx,
  sections,
  skippedSectionIds = [],
}: WizardProgressBarProps) => {
  if (sections) {
    const currentSectionId = steps[currentIdx]?.section;

    return (
      <StyledWizardProgressBar>
        {sections.map((section, index) => {
          const sectionStepIndices = steps
            .map((s, i) => (s.section === section.id ? i : -1))
            .filter((i) => i !== -1);

          const maxIdx =
            sectionStepIndices.length > 0
              ? Math.max(...sectionStepIndices)
              : -1;

          const isBehind = maxIdx !== -1 && currentIdx > maxIdx;
          const isSkipped = isBehind && skippedSectionIds.includes(section.id);
          const isCompleted = isBehind && !isSkipped;
          const isCurrent = currentSectionId === section.id;
          const state = isSkipped
            ? 'skipped'
            : isCompleted
              ? 'completed'
              : isCurrent
                ? 'current'
                : 'todo';

          return (
            <React.Fragment key={section.id}>
              <StyledWizardStep data-state={state}>
                <StyledWizardStepBadge
                  $completed={isCompleted}
                  $current={isCurrent}
                  $skipped={isSkipped}
                >
                  {index + 1}
                </StyledWizardStepBadge>
                <StyledWizardStepText>
                  <StyledWizardStepTitle
                    $completed={isCompleted}
                    $current={isCurrent}
                    $skipped={isSkipped}
                  >
                    {section.label}
                  </StyledWizardStepTitle>
                  {section.duration && (
                    <StyledWizardStepDuration>
                      {section.duration}
                    </StyledWizardStepDuration>
                  )}
                </StyledWizardStepText>
              </StyledWizardStep>
              {index < sections.length - 1 && <StyledWizardStepConnector />}
            </React.Fragment>
          );
        })}
      </StyledWizardProgressBar>
    );
  }

  return (
    <StyledWizardProgressBar>
      {steps.map((step, index) => {
        const isCompleted = currentIdx > index;
        const isCurrent = currentIdx === index;

        return (
          <React.Fragment key={index}>
            <StyledWizardStep>
              <StyledWizardStepBadge
                $completed={isCompleted}
                $current={isCurrent}
              >
                {index + 1}
              </StyledWizardStepBadge>
              <StyledWizardStepText>
                Text
                {step.summary.duration && (
                  <StyledWizardStepDuration>
                    {step.summary.duration}
                  </StyledWizardStepDuration>
                )}
              </StyledWizardStepText>
            </StyledWizardStep>
            {index < steps.length - 1 && <StyledWizardStepConnector />}
          </React.Fragment>
        );
      })}
    </StyledWizardProgressBar>
  );
};
