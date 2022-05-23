import React from 'react';

const PasswordCriterias = () => {
  return (
    <>
      <p className="uk-text-small">Le mot de passe doit&nbsp;:</p>
      <p>
        <ul className="uk-list uk-list-bullet uk-text-small">
          <li>
            Faire au moins{' '}
            <span className="uk-text-primary uk-text-bold">8 caractères</span>{' '}
            de longueur
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
            <span className="uk-text-primary uk-text-bold">chiffres</span>
          </li>
          <li>
            Contenir des{' '}
            <span className="uk-text-primary uk-text-bold">
              caractères spéciaux
            </span>{' '}
            parmi les suivants&nbsp;:
            <br />
            <span className="uk-text-muted">
              {
                '! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ ` { | } ~'
              }
            </span>
          </li>
        </ul>
      </p>
    </>
  );
};

export default PasswordCriterias;
