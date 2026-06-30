import React from 'react';
import { StyledPasswordCriteriasList } from './PasswordCriterias.styles';

export const PasswordCriterias = ({
  removeMargin = false,
  bare = false,
}: {
  removeMargin?: boolean;
  bare?: boolean;
}) => {
  const items = (
    <>
      <li>Doit contenir au moins 8 caractères</li>
      <li>Doit contenir des lettres majuscules et des lettres minuscules</li>
      <li>Doit contenir des chiffres</li>
      <li>
        Doit contenir des caractères spéciaux parmi les suivants&nbsp;:
        <br />
        {'! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ ` { | } ~'}
      </li>
    </>
  );

  if (bare) {
    return (
      <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
        {items}
      </ul>
    );
  }

  return (
    <StyledPasswordCriteriasList removeMargin={removeMargin}>
      {items}
    </StyledPasswordCriteriasList>
  );
};
