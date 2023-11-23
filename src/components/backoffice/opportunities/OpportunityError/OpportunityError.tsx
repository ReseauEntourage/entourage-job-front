import React from 'react';
import { Section } from 'src/components/utils';

export const OpportunityError = () => {
  return (
    <Section className="uk-width-1-1">
      <div className=" uk-text-center uk-flex uk-flex-center">
        <div className="uk-width-xlarge">
          <h2 className="uk-margin-remove">
            Les opportunités n&apos;ont pas pu être chargées correctement.
          </h2>
          <p>
            Contacte{' '}
            <span className="uk-text-primary">l&apos;équipe LinkedOut</span>{' '}
            pour en savoir plus.
          </p>
        </div>
      </div>
    </Section>
  );
};
