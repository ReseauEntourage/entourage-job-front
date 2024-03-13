import React from 'react';
import { DefaultValues } from 'react-hook-form';
import { CVCareerPathSentence } from 'src/components/cv/CVCareerPathSentence';
import { ExtractFormSchemaValidation } from 'src/components/forms/FormSchema';
import { formEditCareerPath } from 'src/components/forms/schemas/formEditCareerPath';
import { openModal } from 'src/components/modals/Modal';
import { ModalEdit } from 'src/components/modals/Modal/ModalGeneric/ModalEdit';
import { Card } from 'src/components/utils';
import {
  AMBITIONS_PREFIXES,
  AmbitionsPrefixesType,
  BUSINESS_LINES,
  BusinessLineValue,
} from 'src/constants';
import { findConstantFromValue, sortByOrder } from 'src/utils';

interface CareerPaths {
  ambitions: {
    order: number;
    name: string;
    prefix: AmbitionsPrefixesType;
  }[];
  businessLines: {
    order: number;
    name: BusinessLineValue;
  }[];
}

type CVEditCareerPathProps = CareerPaths & {
  onChange: (updatedCareerPath: CareerPaths) => void;
};

export const CVEditCareerPath = ({
  ambitions,
  businessLines,
  onChange,
}: CVEditCareerPathProps) => {
  const sortedAmbitions =
    ambitions && ambitions.length > 0 ? sortByOrder(ambitions) : null;

  const sortedBusinessLines =
    businessLines && businessLines.length > 0
      ? sortByOrder(businessLines)
      : null;

  const defaultValues: DefaultValues<
    ExtractFormSchemaValidation<typeof formEditCareerPath>
  > = {
    ...sortedAmbitions?.reduce((acc, curr) => {
      return {
        ...acc,
        [`ambition${curr.order}`]: curr.name,
      };
    }, {}),
    ...sortedBusinessLines?.reduce((acc, curr) => {
      return {
        ...acc,
        [`businessLine${curr.order}`]: findConstantFromValue(
          curr.name,
          BUSINESS_LINES
        ),
      };
    }, {}),
  };

  return (
    <Card
      title="Mon projet professionnel"
      editCallback={() => {
        openModal(
          <ModalEdit
            title="Édition - Projet professionnel"
            description="J'aimerais travailler ..."
            formSchema={formEditCareerPath}
            defaultValues={defaultValues}
            onSubmit={async (
              { ambition0, businessLine0, ambition1, businessLine1 },
              closeModal
            ) => {
              closeModal();
              let newAmbitions = [] as {
                prefix: AmbitionsPrefixesType;
                name: string;
                order: number;
              }[];
              if (ambition0) {
                newAmbitions = [
                  ...newAmbitions,
                  {
                    prefix: AMBITIONS_PREFIXES[1].label,
                    name: ambition0,
                    order: 0,
                  },
                ];
              }
              if (ambition1) {
                newAmbitions = [
                  ...newAmbitions,
                  {
                    prefix: AMBITIONS_PREFIXES[1].label,
                    name: ambition1,
                    order: 1,
                  },
                ];
              }
              let newBusinessLines = [] as {
                name: BusinessLineValue;
                order: number;
              }[];
              if (businessLine0) {
                newBusinessLines = [{ name: businessLine0.value, order: 0 }];
              }
              if (businessLine1) {
                newBusinessLines = [
                  ...newBusinessLines,
                  { name: businessLine1.value, order: 1 },
                ];
              }
              onChange({
                businessLines: newBusinessLines,
                ambitions: newAmbitions,
              });
            }}
          />
        );
      }}
    >
      {!sortedAmbitions && !sortedBusinessLines ? (
        <p className="uk-text-italic">
          Aucun projet professionnel n&apos;a pas encore été créé.
        </p>
      ) : (
        <p>
          <CVCareerPathSentence
            ambitions={ambitions}
            businessLines={businessLines}
          />
        </p>
      )}
    </Card>
  );
};
