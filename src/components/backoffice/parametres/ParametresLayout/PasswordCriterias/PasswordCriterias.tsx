import React from 'react';
import { StyledPasswordCriteriasList } from './PasswordCriterias.styles';

export const PasswordCriterias = () => {
  return (
    <StyledPasswordCriteriasList>
      <li>Faire au moins 8 caractères de longueur</li>
      <li>Contenir des lettres majuscules et des lettres minuscules</li>
      <li>Contenir des chiffres</li>
      <li>
        Contenir des caractères spéciaux parmi les suivants&nbsp;:
        <br />
        {'! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ ` { | } ~'}
      </li>
    </StyledPasswordCriteriasList>
  );
};
