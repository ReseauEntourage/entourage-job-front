import React from 'react';
import { formEditCatchphrase } from 'src/components/forms/schemas/formEditCatchphrase';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Card } from 'src/components/utils';

export const CVEditCatchphrase = ({
  catchphrase,
  onChange,
}: {
  catchphrase: string;
  onChange?: (updatedCV: { catchphrase: string }) => void;
}) => {
  return (
    <Card
      title="Ma phrase d'accroche"
      dataTestId="cv-catchphrase"
      editCallback={
        onChange
          ? () =>
              openModal(
                <ModalEdit
                  title="Édition - Ma phrase d'accroche"
                  formSchema={formEditCatchphrase}
                  defaultValues={{ catchphrase }}
                  onSubmit={async (fields, closeModal) => {
                    closeModal();
                    await onChange({
                      ...fields,
                    });
                  }}
                />
              )
          : undefined
      }
    >
      {catchphrase ? (
        <p data-testid="cv-edit-catchphrase-content">{catchphrase}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune phrase d&apos;accroche n&apos;a encore été créé
        </p>
      )}
    </Card>
  );
};
