import React from 'react';
import { formEditCatchphrase } from 'src/components/forms/schemas/formEditCatchphrase';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon } from 'src/components/utils';

export const CVEditCatchphrase = ({
  catchphrase,
  onChange,
}: {
  catchphrase: string;
  onChange?: (arg1: { catchphrase: string }) => void; // to be typed
}) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Ma <span className="uk-text-primary">phrase d&apos;accroche</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            dataTestId="test-catchphrase-edit-icon"
            onClick={() => {
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
              );
            }}
          />
        )}
      </Grid>
      {catchphrase ? (
        <p data-testid="cv-edit-catchphrase-content">{catchphrase}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune phrase d&apos;accroche n&apos;a encore été créé
        </p>
      )}
    </div>
  );
};
