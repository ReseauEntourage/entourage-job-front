import React from 'react';
import schemaStory from 'src/components/forms/schema/formEditStory.json';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Grid, ButtonIcon } from 'src/components/utils';
import { formatParagraph } from 'src/utils/Formatting';

export const StoryProfileCard = ({
  description,
  onChange,
}: {
  description?: string;
  onChange?: (arg1: any) => void; // to be typed
}) => {
  return (
    <div className="uk-card uk-card-default uk-card-body">
      <Grid gap="small" between eachWidths={['expand', 'auto']}>
        <h3 className="uk-card-title">
          Mon <span className="uk-text-primary">histoire</span>
        </h3>
        {onChange && (
          <ButtonIcon
            name="pencil"
            onClick={() => {
              openModal(
                <ModalEdit
                  title="Édition - Mon histoire"
                  formSchema={schemaStory}
                  defaultValues={{ story: description }}
                  onSubmit={async (fields, closeModal) => {
                    closeModal();
                    await onChange({ ...fields });
                  }}
                />
              );
            }}
          />
        )}
      </Grid>

      {description ? (
        <p>{formatParagraph(description)}</p>
      ) : (
        <p className="uk-text-italic">
          Aucune histoire n&apos;a encore été ajoutée
        </p>
      )}
    </div>
  );
};

StoryProfileCard.defaultProps = {
  description: '',
  onChange: null,
};
export default StoryProfileCard;
