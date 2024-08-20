import React from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formInterestLinkedOut } from 'src/components/forms/schemas/formInterestLinkedOut';
import { Section, SimpleLink } from 'src/components/utils';
import { useResetForm } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';

const Contact = () => {
  const [form, resetForm] = useResetForm();
  const dispatch = useDispatch();
  const CONTACT_NUMBER = '07 49 69 31 12';

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
                    type: 'danger',
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
        <h4 className="uk-align-center uk-text-center uk-margin-large-bottom">
          Vous êtes journaliste&nbsp;? Contactez-nous :
          <br />
          <br />
          <SimpleLink
            className="uk-link uk-margin-small-top uk-margin-small-bottom"
            href={`mailto:${process.env.MAILJET_CONTACT_EMAIL}`}
            target="_blank"
            isExternal
          >
            {process.env.MAILJET_CONTACT_EMAIL}
          </SimpleLink>
          <br />
          <div className="uk-margin-small-top uk-margin-small-bottom uk-text-italic uk-text-muted">
            ou
          </div>
          <SimpleLink
            className="uk-link"
            href={`tel:${CONTACT_NUMBER}`}
            isExternal
          >
            {CONTACT_NUMBER}
          </SimpleLink>
        </h4>
      </Section>
    </Layout>
  );
};

export default Contact;
