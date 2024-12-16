import React from 'react';
import { StyledPasswordCriteriasList } from './PasswordCriterias.styles';

export const PasswordCriterias = ({
  removeMargin = false,
}: {
  removeMargin?: boolean;
}) => {
  return (
    <StyledPasswordCriteriasList removeMargin={removeMargin}>
      <li>Doit contenir au moins 8 caractères</li>
      <li>Doit contenir des lettres majuscules et des lettres minuscules</li>
      <li>Doit contenir des chiffres</li>
      <li>
        Doit contenir des caractères spéciaux parmi les suivants&nbsp;:
        <br />
        {'! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ ` { | } ~'}
      </li>
    </StyledPasswordCriteriasList>
  );
};
