import React from 'react';

const PasswordCriterias = () => {
  return (
    <>
      <p>Le mot de passe doit :</p>
      <p>
        <ul className="uk-list uk-list-bullet">
          <li>
            Faire au moins{' '}
            <span className="uk-text-primary uk-text-bold">8 caractères</span>
          </li>
          <li>
            Contenir des{' '}
            <span className="uk-text-primary uk-text-bold">
              lettres majuscules
            </span>{' '}
            et des{' '}
            <span className="uk-text-primary uk-text-bold">
              lettres minuscules
            </span>
          </li>
          <li>
            Contenir des{' '}
            <span className="uk-text-primary uk-text-bold">
              caractères spéciaux
            </span>
          </li>
        </ul>
      </p>
    </>
  );
};

export default PasswordCriterias;
