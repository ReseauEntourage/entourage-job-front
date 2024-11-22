## Messaging

### Structure de la Messagerie Interne

#### Messaging - Général

- `Messaging.tsx` : Ce composant principal gère l'affichage de la messagerie en fonction de la plateforme (desktop ou mobile).
- `Messaging.desktop.tsx` : Ce composant gère l'affichage de la messagerie pour les utilisateurs sur desktop.
- `Messaging.mobile.tsx` : Ce composant gère l'affichage de la messagerie pour les utilisateurs sur mobile.
- `MessagingEmptyState`: Ce composant permet d'inviter l'utilisateur a créer sa première conversation avec un membre du réseau d'entraide

### Messaging - Liste de conversation

- `MessagingConversationList`: Ce composant affiche la liste des conversations.
- `MessagingConversationListItem`: Ce composant affiche un élément de la liste des conversations.

### Messaging - Conversation

- `MessagingConversation`: Ce composant affiche une conversation spécifique.
- `MessagingConversationHeader.tsx`: Ce composant affiche l'en-tête d'une conversation.
- `MessagingConversationLoader`: Ce composant est affiché lors du chargement d'une conversation.
- `MessagingConversationReport`: Ce composant est une modale permettant de signaler une conversation.
- `MessagingMessage`: Ce composant affiche un message individuel dans une conversation.
- `MessagingPinnedInfo`: Ce composant affiche une information avertissement en haut de la conversation pour prévenir l'utilisateur d'informations utiles sur la messagerie ouverte.

### Store

Le store correspondant à la fonctionnalité de `Messaging` est situé dans `src/use-cases/messaging`

### Conclusion

D'autres informations sur la partie back-end de la messagerie sont situés dans le repository `entourage-job-back` => `docs/messaging.md`
