import React from 'react';
import PencilIcon from 'assets/icons/pencil.svg';
import { formEditCatchphrase } from 'src/components/forms/schemas/formEditCatchphrase';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon } from 'src/components/utils';

export const CVEditCatchphrase = ({
  catchphrase,
  onChange,
}: {
  catchphrase: string;
  onChange?: (updatedCV: { catchphrase: string }) => void;
}) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Ma <span className="uk-text-primary">phrase d&apos;accroche</span>
        </h3>
        <ButtonIcon
          icon={<PencilIcon />}
          dataTestId="test-catchphrase-edit-icon"
          onClick={() => {
            openModal(
              <ModalEdit
                title="Édition - Ma phrase d'accroche"
                formSchema={formEditCatchphrase}
                defaultValues={{ catchphrase }}
                onSubmit={async (fields, closeModal) => {
                  closeModal();
                  // @ts-expect-error after enable TS strict mode. Please, try to fix it
                  await onChange({
                    ...fields,
                  });
                }}
              />
            );
          }}
        />
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
