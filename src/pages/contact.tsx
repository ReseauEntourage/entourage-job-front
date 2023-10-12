import React from 'react';
import UIkit from 'uikit';

import { Api } from 'src/api';
import { Layout } from 'src/components/Layout';
import { FormWithValidation } from 'src/components/forms/FormWithValidation';
import { formInterestLinkedOut } from 'src/components/forms/schemas/formInterestLinkedOut';
import { Section, SimpleLink } from 'src/components/utils';
import { useResetForm } from 'src/hooks/utils';

const Contact = () => {
  const [form, resetForm] = useResetForm();

  const contactPerCity = {
    Paris: '07 82 44 97 39',
    Lille: '07 83 85 48 95',
    Lyon: '07 67 35 05 86',
  };

  return (
    <Layout title="Contact - LinkedOut">
      <Section container="small" style="default">
        <h1 className="uk-text-bold uk-align-center uk-text-center uk-margin-large-bottom uk-margin-remove-top">
          Formulaire de <span className="uk-text-primary">contact</span>
        </h1>
        <h4 className="uk-align-center uk-text-center uk-margin-large-bottom">
          Vous êtes un acteur de l&apos;insertion sociale et professionnelle
          intéressé(e) par l’approche de LinkedOut et souhaitez coopérer avec
          nous&nbsp;? Vous êtes un recruteur et souhaitez en savoir plus sur le
          dispositif LinkedOut&nbsp;? Ou vous êtes simplement un particulier et
          avez des questions sur le projet&nbsp;?
        </h4>
        <FormWithValidation
          innerRef={form}
          submitText="Envoyer"
          formSchema={formInterestLinkedOut}
          onSubmit={(fields) => {
            return Api.postContactContactUs(fields)
              .then(() => {
                UIkit.notification('Merci pour votre message.', 'success');
                resetForm();
              })
              .catch(() => {
                return UIkit.notification(
                  "Une erreur s'est produite",
                  'danger'
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
          <div className="uk-margin-small-top uk-text-italic uk-text-muted">
            ou
          </div>
          <ul className="uk-list">
            {Object.keys(contactPerCity).map((contact) => {
              return (
                <li key={contact}>
                  <span className="uk-text-bold">{contact}&nbsp;:&nbsp;</span>
                  <SimpleLink
                    className="uk-link"
                    href={`tel:${contactPerCity[contact]}`}
                    isExternal
                  >
                    {contactPerCity[contact]}
                  </SimpleLink>
                </li>
              );
            })}
          </ul>
        </h4>
      </Section>
    </Layout>
  );
};

export default Contact;