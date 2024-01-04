import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { openModal, useModalContext } from 'src/components/modals/Modal';
import { ModalGeneric } from 'src/components/modals/Modal/ModalGeneric';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Button, Grid } from 'src/components/utils';
import { StyledSlider, StyledToggle, StyledToggleContainer, StyledToggleLabel } from './ToggleWithConfirmationModal.styles';
import { FormSchema } from 'src/components/forms/FormSchema';
import { AnyCantFix } from 'src/utils/Types';
import { ModalToggle } from './ModalToggle';


interface ToggleWithConfirmationModalProps<S extends FormSchema<AnyCantFix>> {
  id: string;
  title: string;
  subtitle: React.ReactNode;
  modalTitle: string;
  modalDescription: React.ReactNode;
  modalConfirmation: string;
  onToggle: (fields?: AnyCantFix) => void;
  isToggled: boolean;
  formSchema: S;
}

export const ToggleWithConfirmationModal = <S extends FormSchema<AnyCantFix>>({
  id,
  title,
  subtitle,
  modalTitle,
  modalDescription,
  modalConfirmation = "oui",
  onToggle,
  formSchema,
  isToggled,
}: ToggleWithConfirmationModalProps<S>) => {


  return (
      <StyledToggleContainer>
          <StyledToggle>
            <label htmlFor={`ent-toggle-${id}`}>
              <input
                id={`ent-toggle-${id}`}
                data-testid={`test-toggle-${id}`}
                type="checkbox"
                checked={isToggled}
                onChange={() => {
                  if (isToggled) {
                    onToggle()
                  } else if (formSchema) {
                    openModal(
                      <ModalEdit
                        title={modalTitle}
                        description={modalDescription}
                        formSchema={formSchema}
                        submitText={modalConfirmation}
                        // id={id}
                        onSubmit={async (fields) => {
                          await onToggle(fields);
                        }}
                      />
                    );
                  } else {
                    openModal(
                      <ModalToggle
                        modalTitle={modalTitle}
                        id={id}
                        modalDescription={modalDescription}
                        modalConfirmation={modalConfirmation}
                        onToggle={onToggle}
                      />
                    );
                  }
                }}
              />
              <StyledSlider/>
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


