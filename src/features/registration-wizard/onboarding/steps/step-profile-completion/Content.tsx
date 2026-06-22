import React, { useEffect, useMemo } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { Text } from '@/src/components/ui';
import { AccordionGroup } from '@/src/components/ui/Accordion/AccordionGroup';
import { listCompletionFields } from '@/src/features/forms/utils/computeCompletionRate.utils';
import { useCurrentUserProfile } from '@/src/hooks/current-user/useCurrentUserProfile';
import { CompletionStatus } from './CompletionStatus';
import { StyledProfileSubHeader } from './Content.styles';
import { CvCompletionAccordion } from './components/CvCompletionAccordion/CvCompletionAccordion';
import { PersonalInfoAccordion } from './components/PersonalInfoAccordion';
import { ProfileCompletionFormValues } from './types';

export const Content = () => {
  const userProfile = useCurrentUserProfile();
  const { control, trigger, getFieldState, formState } =
    useFormContext<ProfileCompletionFormValues>();

  const formValues = useWatch({ control });

  // We want a validity-based completion rate, but without showing errors
  // before the first submit attempt.
  // Trigger an initial validation pass so required/minLength rules are reflected
  // in the completion rate from the start.
  useEffect(() => {
    void trigger();
  }, [trigger]);

  const completion = useMemo(() => {
    // If the user already has a picture OR just selected one in the form,
    // count it as completed.
    const donePicture = !!userProfile?.hasPicture || !!formValues?.profileImage;

    const fields = listCompletionFields(formValues, {
      excludePaths: [
        'profileImageObjectUrl',
        'profileImage',
        'businessSectorId0',
        'occupation0',
        'businessSectorId1',
        'occupation1',
        'currentJob',
        'companyName',
        'businessSectorIds',
        'linkedinUrl',
      ],
    });

    // Only count fields that are either:
    // - filled (so they impact completion), OR
    // - currently invalid (typically required fields not filled yet)
    // This way, optional untouched fields don't penalize the completion rate.
    const includedFields = fields.filter((f) => {
      const fieldState = getFieldState(f.path as never, formState);
      return f.isFilled || fieldState.invalid;
    });

    const total = includedFields.length + 1; // + picture
    if (total === 0) {
      return 0;
    }

    const doneFieldsCount = includedFields.filter((f) => {
      const fieldState = getFieldState(f.path as never, formState);
      return f.isFilled && !fieldState.invalid;
    }).length;

    const done = doneFieldsCount + (donePicture ? 1 : 0);
    return Math.round((done / total) * 100);
  }, [formState, formValues, getFieldState, userProfile?.hasPicture]);

  return (
    <>
      <StyledProfileSubHeader>
        <Text>Les champs marqués d’un astérisque (*) sont obligatoires</Text>
        <CompletionStatus completion={completion} />
      </StyledProfileSubHeader>
      <br />
      <br />
      <AccordionGroup>
        <PersonalInfoAccordion />
        <CvCompletionAccordion />
      </AccordionGroup>
    </>
  );
};
