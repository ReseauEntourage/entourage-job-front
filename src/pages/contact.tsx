import React from 'react';
import { useDispatch } from 'react-redux';

import { Layout } from '@/src/components/layouts/Layout';
import { Section } from '@/src/components/ui';
import { Api } from 'src/api';
import { FormWithValidation } from 'src/features/forms/FormWithValidation';
import { formInterestLinkedOut } from 'src/features/forms/schemas/formInterestLinkedOut';
import { useResetForm } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';

const Contact = () => {
  const [form, resetForm] = useResetForm();
  const dispatch = useDispatch();

  return (
    <Layout title="Contact - Entourage Pro">
      <Section container="small" style="default">
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Formulaire de <span className="uk-text-primary">contact</span>
        </h1>
        <h4 className="uk-align-center uk-text-center uk-margin-large-bottom">
          Vous êtes un acteur de l&apos;insertion sociale et professionnelle
          intéressé(e) par l’approche de Entourage Pro et souhaitez coopérer
          avec nous&nbsp;? Vous êtes un recruteur et souhaitez en savoir plus
          sur le dispositif Entourage Pro&nbsp;? Ou vous êtes simplement un
          particulier et avez des questions sur le projet&nbsp;?
        </h4>
        <FormWithValidation
          innerRef={form}
          submitText="Envoyer"
          formSchema={formInterestLinkedOut}
          onSubmit={(fields) => {
            return Api.postContactContactUs(fields)
              .then(() => {
                dispatch(
                  notificationsActions.addNotification({
                    type: 'success',
                    message: 'Merci pour votre message',
                  })
                );
                resetForm();
              })
              .catch(() => {
                dispatch(
                  notificationsActions.addNotification({
                    type: 'danger',
                    message: "Une erreur s'est produite",
                  })
                );
              });
          }}
        />
      </Section>
    </Layout>
  );
};

export default Contact;
