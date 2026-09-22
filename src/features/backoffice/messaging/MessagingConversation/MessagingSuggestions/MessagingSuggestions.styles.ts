import { styled } from 'styled-components';

/**
 * Bandeau compact accolé à l'éditeur, sur le modèle des réponses rapides :
 * il épouse la hauteur de son contenu au lieu d'occuper la zone du fil de
 * discussion, qui reste vide tant qu'aucun message n'a été échangé.
 */
export const MessagingSuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const MessagingSuggestionsListContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;

export const MessagingQuickRepliesContainer = styled.div`
  display: flex;
  padding: 10px 20px;
  box-sizing: border-box;
  width: 100%;
`;

export const MessagingQuickRepliesListContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;
