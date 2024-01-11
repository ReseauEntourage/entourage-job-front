import React from 'react';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formEditEmployed } from 'src/components/forms/schemas/formEditEmployed';
import {
  ModalType,
  ToggleWithModal,
} from 'src/components/utils/Inputs/ToggleWithModal';

interface CandidateEmployedToggleProps {
  title: string;
  subtitle?: React.ReactNode | string;
  modal: React.ReactNode | ModalType;
  isToggled: boolean;
  onToggle: (
    value: boolean,
    fields?: ExtractFormSchemaValidation<typeof formEditEmployed>,
    onClose?: () => void
  ) => void | Promise<void>;
}

export const CandidateEmployedToggle = ({
  title,
  subtitle,
  isToggled,
  onToggle,
  modal,
}: CandidateEmployedToggleProps) => {
  return (
    <ToggleWithModal
      id="employedToggle"
      title={title}
      subtitle={subtitle}
      modal={modal}
      isToggled={isToggled}
      onToggle={onToggle}
      formSchema={formEditEmployed}
    />
  );
};
