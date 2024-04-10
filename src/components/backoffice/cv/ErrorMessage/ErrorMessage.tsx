import React from 'react';

export const ErrorMessage = ({ error }: { error?: string }) => {
  return (
    <div className="uk-width-1-1 uk-text-center">
      <div className="ukuk-width-xlarge">
        <h2 className="uk-text-bold uk-margin-remove">{error}</h2>
        <p>
          Contacte{' '}
          <span className="uk-text-primary">l&apos;équipe Entourage Pro</span>{' '}
          pour en savoir plus.
        </p>
      </div>
    </div>
  );
};
