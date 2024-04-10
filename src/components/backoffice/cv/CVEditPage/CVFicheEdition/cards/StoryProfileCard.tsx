import React from 'react';
import { formEditStory } from 'src/components/forms/schemas/formEditStory';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Card } from 'src/components/utils';
import { formatParagraph } from 'src/utils/Formatting';

export const StoryProfileCard = ({
  description,
  onChange,
}: {
  description?: string;
  onChange: (updatedStory: { story: string }) => void;
}) => {
  return (
    <Card
      title="Ma présentation"
      dataTestId="cv-story"
      editCallback={() =>
        openModal(
          <ModalEdit
            title="Édition - Ma présentation"
            formSchema={formEditStory}
            defaultValues={{ story: description }}
            onSubmit={(fields, closeModal) => {
              closeModal();
              onChange(fields);
            }}
          />
        )
      }
    >
      {description ? (
        <p data-testid="cv-edit-story-content">
          {formatParagraph(description)}
        </p>
      ) : (
        <p className="uk-text-italic">
          Aucune présentation n&apos;a encore été ajoutée
        </p>
      )}
    </Card>
  );
};
