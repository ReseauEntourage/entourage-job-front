import React from 'react';
import {
  ExtractFormSchemaValidation,
  FormSchema,
} from 'src/components/forms/FormSchema';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { AnyCantFix } from 'src/utils/Types';
import { ModalToggle } from './ModalToggle';
import {
  StyledSlider,
  StyledToggle,
  StyledToggleContainer,
  StyledToggleLabel,
} from './ToggleWithModal.styles';

export interface ModalType {
  title: string;
  description?: React.ReactNode;
  confirmationText?: string;
}

interface ToggleWithModalProps<S extends FormSchema<AnyCantFix>> {
  id: string;
  title: string;
  subtitle?: React.ReactNode;
  modal?: ModalType | React.ReactNode;
  onToggle: (
    value: boolean,
    fields?: ExtractFormSchemaValidation<S>,
    onClose?: () => void
  ) => void | Promise<void>;
  isToggled: boolean;
  formSchema?: S;
}

export const ToggleWithModal = <S extends FormSchema<AnyCantFix>>({
  id,
  title,
  subtitle,
  modal,
  onToggle,
  formSchema,
  isToggled,
}: ToggleWithModalProps<S>) => {
  return (
    <StyledToggleContainer>
      <StyledToggle>
        <label htmlFor={`ent-toggle-${id}`}>
          <input
            id={`ent-toggle-${id}`}
            data-testid={`test-toggle-${id}`}
            type="checkbox"
            checked={isToggled}
            onChange={async () => {
              if (!modal || isToggled) {
                await onToggle(!isToggled);
                // custom Modal (usually with redux)
              } else if (modal && React.isValidElement(modal)) {
                openModal(modal);
                // edit form in Modal
              } else if (
                formSchema &&
                typeof modal === 'object' &&
                modal &&
                'title' in modal
              ) {
                openModal(
                  <ModalEdit
                    title={modal.title}
                    description={modal.description}
                    formSchema={formSchema}
                    submitText={modal.confirmationText || 'oui'}
                    onSubmit={async (fields, onClose) => {
                      try {
                        await onToggle(true, fields, onClose);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  />
                );
                // generic Modal Confirmation
              } else if (
                typeof modal === 'object' &&
                modal &&
                'title' in modal
              ) {
                openModal(
                  <ModalToggle
                    modalTitle={modal.title}
                    id={id}
                    modalDescription={modal.description}
                    modalConfirmation={modal.confirmationText || 'oui'}
                    onToggle={() => onToggle(true)}
                  />
                );
              }
            }}
          />
          <StyledSlider isToggled={isToggled} />
        </label>
      </StyledToggle>
      {(title || subtitle) && (
        <StyledToggleLabel>
          {title && <span>{title}</span>}
          {subtitle}
        </StyledToggleLabel>
      )}
    </StyledToggleContainer>
  );
};
