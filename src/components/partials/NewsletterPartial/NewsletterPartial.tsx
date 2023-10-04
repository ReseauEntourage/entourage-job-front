import React, { useState } from 'react';
import UIkit from 'uikit';

import { v4 as uuid } from 'uuid';
import { isEmail } from 'validator';
import { Api } from 'src/api';
import { StyledNLForm } from 'src/components/partials/NewsletterPartial/NewsletterPartial.styles';
import { Section } from 'src/components/utils';
import { Button } from 'src/components/utils/Button';
import { CheckBox } from 'src/components/utils/Inputs/CheckBox';
import { TextInput } from 'src/components/utils/Inputs/TextInput';
import { NEWSLETTER_TAGS } from 'src/constants';
import { useNewsletterTracking } from 'src/hooks';
import { gaEvent } from 'src/lib/gtag';

const uuidValue = uuid();

export const NewsletterPartial = ({
  style = 'default',
  padding = true,
  tag,
}: {
  style?: 'default' | 'muted';
  padding?: boolean;
  tag?: { action: string; label?: string };
}) => {
  const [email, setEmail] = useState<string>('');
  const [zone, setZone] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [isMailValid, setIsMailValid] = useState<boolean>(true);
  const [isTagsValid, setIsTagsValid] = useState<boolean>(true);
  const newsletterParams = useNewsletterTracking();

  const onSubmit = async () => {
    const mailValid = isEmail(email);
    // const tagsValid = !isEmpty(zone) && !isEmpty(status);

    if (!mailValid /* || !tagsValid */) {
      setIsMailValid(mailValid);
      // setIsTagsValid(tagsValid);
    } else {
      gaEvent(tag);
      try {
        await Api.postNewsletter({
          email,
          zone,
          status,
          ...newsletterParams,
        });
        UIkit.notification(
          'Votre inscription à la newsletter a bien été prise en compte !',
          'success'
        );
        setEmail('');
        setZone(null);
        setStatus(null);
      } catch (err) {
        console.error(err);
        UIkit.notification('Une erreur est survenue', 'danger');
      }
      setIsMailValid(true);
      setIsTagsValid(true);
    }
  };

  return (
    <Section
      id="newsletterForm"
      style={style}
      className={!padding ? 'uk-padding-remove-vertical' : ''}
    >
      <div className="uk-text-center">
        <h4 className="uk-align-center uk-text-bold uk-width-1-2@m">
          Inscrivez-vous à la newsletter pour avoir des nouvelles des candidats
          et être informé(e) de l&apos;évolution du projet&nbsp;!
        </h4>
      </div>

      <StyledNLForm>
        <div className="form-group">
          <div className="group-name">Je suis :</div>
          <div className="checkbox-container">
            {NEWSLETTER_TAGS.STATUS.map(({ tag: tagConst, label }, key) => {
              return (
                <div className="input-label" key={`${key}-status-${uuidValue}`}>
                  <div>
                    <CheckBox
                      id={tagConst}
                      name={tagConst}
                      useOutsideOfForm
                      value={tagConst === status}
                      title={label}
                      onChange={() => {
                        if (status === tagConst) {
                          setStatus(null);
                        } else {
                          setStatus(tagConst);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="form-group">
          <div className="group-name">J&apos;habite :</div>
          <div className="checkbox-container">
            {NEWSLETTER_TAGS.ZONE.map(({ tag: tagConst, label }, key) => {
              return (
                <div className="input-label" key={`${key}-zone-${uuidValue}`}>
                  <div>
                    <CheckBox
                      id={tagConst}
                      name={tagConst}
                      useOutsideOfForm
                      value={tagConst === zone}
                      title={label}
                      onChange={() => {
                        if (zone === tagConst) {
                          setZone(null);
                        } else {
                          setZone(tagConst);
                        }
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="form-group text-input-container">
          <TextInput
            title="Renseignez votre adresse email"
            type="email"
            style="secondary"
            onChange={(value) => {
              return setEmail(value);
            }}
            value={email}
            id="nl-email-input"
            name="nl-email-input"
          />
        </div>
        {!isMailValid && (
          <div data-testid="nl-error-msg" className="uk-text-danger">
            Adresse mail invalide.
          </div>
        )}
        {!isTagsValid && (
          <div className="uk-text-danger uk-text-center">
            Veuillez renseigner les informations.
          </div>
        )}
        <div className="uk-flex uk-flex-center uk-margin-small-top">
          <Button
            style="custom-secondary-inverted"
            onClick={onSubmit}
            dataTestId="nl-submit-btn"
          >
            S&apos;abonner à la newsletter !
          </Button>
        </div>
      </StyledNLForm>
    </Section>
  );
};
