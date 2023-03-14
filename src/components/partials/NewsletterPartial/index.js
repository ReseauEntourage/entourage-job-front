import UIkit from 'uikit';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Section } from 'src/components/utils';
import Api from 'src/api/index.ts';
import { Button } from 'src/components/utils/Button';
import { gaEvent } from 'src/lib/gtag';
import { NEWSLETTER_TAGS } from 'src/constants';
import Checkbox from 'src/components/utils/Inputs/Checkbox';
import { StyledPrimaryTextInput } from 'src/styles/components/inputs/styles';
import uuid from 'uuid/v4';
import { StyledNLForm } from 'src/components/partials/NewsletterPartial/styles';
import { useNewsletterTracking } from 'src/hooks';

const NewsletterPartial = ({ style, padding, tag }) => {
  const [email, setEmail] = useState('');
  const [zone, setZone] = useState();
  const [status, setStatus] = useState();
  const [isMailValid, setIsMailValid] = useState(true);
  const [isTagsValid, setIsTagsValid] = useState(true);
  const newsletterParams = useNewsletterTracking();

  const onSubmit = async () => {
    const mailValid = validator.isEmail(email);
    // const tagsValid = !validator.isEmpty(zone) && !validator.isEmpty(status);

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
        setZone();
        setStatus();
      } catch {
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
                <div className="input-label" key={`${key}-${uuid}`}>
                  <div>
                    <Checkbox
                      checked={tagConst === status}
                      handleClick={() => {
                        if (status === tagConst) {
                          setStatus();
                        } else {
                          setStatus(tagConst);
                        }
                      }}
                    />
                  </div>
                  <span className="label">{label}</span>
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
                <div className="input-label" key={`${key}-${uuid}`}>
                  <div>
                    <Checkbox
                      checked={tagConst === zone}
                      handleClick={() => {
                        if (zone === tagConst) {
                          setZone();
                        } else {
                          setZone(tagConst);
                        }
                      }}
                    />
                  </div>
                  <span className="label">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="form-group">
          <StyledPrimaryTextInput
            type="email"
            placeholder="Renseignez votre adresse email"
            onChange={(e) => {
              return setEmail(e.target.value);
            }}
            value={email}
            data-testid="nl-email-input"
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
          <Button style="primary" onClick={onSubmit} dataTestId="nl-submit-btn">
            S&apos;abonner à la newsletter !
          </Button>
        </div>
      </StyledNLForm>
    </Section>
  );
};

NewsletterPartial.propTypes = {
  padding: PropTypes.bool,
  tag: PropTypes.shape({}),
  style: PropTypes.oneOf(['default', 'muted']),
};

NewsletterPartial.defaultProps = {
  padding: true,
  tag: undefined,
  style: 'default',
};

export default NewsletterPartial;
