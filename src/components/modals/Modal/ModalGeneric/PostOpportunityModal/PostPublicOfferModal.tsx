import React from 'react';
import { formEditOpportunity as defaultSchema } from 'src/components/forms/schema/formEditOpportunity';
import { mutateFormSchema } from 'src/utils';
import { PostOpportunityModal } from './PostOpportunityModal';

export const PostPublicOfferModal = () => {
  const mutatedSchema = mutateFormSchema(
    defaultSchema,
    [
      {
        fieldId: 'candidatesIds',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
      {
        fieldId: 'isPublic',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
      {
        fieldId: 'message',
        props: [
          {
            propName: 'disabled',
            value: true,
          },
          {
            propName: 'hidden',
            value: true,
          },
        ],
      },
    ],
    'post-job-ad'
  );

  const postPublicOfferModalProps = {
    defaultValues: {
      isPublic: true,
    },
    modalTitle: 'Proposer une opportunité',
    modalDesc:
      'Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer une opportunité visible par tous les candidats.',
    schema: mutatedSchema,
  };

  return <PostOpportunityModal {...postPublicOfferModalProps} />;
};
