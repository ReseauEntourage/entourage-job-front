import React from 'react';
import schema from 'src/components/forms/schema/formEditOpportunity';
import { mutateFormSchema } from 'src/utils';
import { PostOpportunityModal } from './PostOpportunityModal';

export const PostPublicOfferModal = () => {
  const mutatedSchema = mutateFormSchema(
    schema,
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

  const ModalProps = {
    defaultValues: {
      isPublic: true,
    },
    modalTitle: 'Proposer une opportunité',
    modalDesc:
      'Cet espace est dédié aux potentiels recruteurs qui souhaitent proposer une opportunité visible par tous les candidats.',
    schema: mutatedSchema,
  };

  return <PostOpportunityModal {...ModalProps} />;
};

export default PostPublicOfferModal;
