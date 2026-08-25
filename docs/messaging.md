## Messaging

La messagerie permet aux utilisateurs de la plateforme (candidats, coachs, prescripteurs) d'échanger des messages privés, avec pièces jointes, suggestions de messages, assistant IA et système de feedback.

> Pour la partie back-end, voir `entourage-job-back/docs/messaging.md`.

---

### Structure des fichiers

```
src/
├── use-cases/messaging/              # State management (Redux Toolkit + RTK Query)
│   ├── messaging.slice.ts            # état d'interface local
│   ├── messaging.api.ts              # endpoints RTK Query + mises à jour de cache
│   ├── messaging.listeners.ts        # actions déclencheuses -> endpoints
│   ├── messaging.selectors.ts
│   └── index.ts
│
├── api/
│   ├── api.ts                        # Endpoints API messaging et assistant IA
│   └── types.ts                      # Types Message, Conversation, Media...
│
├── features/backoffice/messaging/    # Composants UI
│   ├── Messaging.tsx                 # Point d'entrée (responsive)
│   ├── Messaging.desktop.tsx
│   ├── Messaging.mobile.tsx
│   ├── MessagingEmptyState.tsx
│   ├── messaging.utils.ts
│   ├── RecapSuggestedMessage/        # Récapitulatif du message suggéré
│   ├── MessagingAIPanel/             # Assistant IA (panneau latéral)
│   │   ├── MessagingAIPanel.tsx
│   │   ├── MessagingAIAssistant.tsx
│   │   └── AssistantMessageBubble/
│   ├── MessagingConversationsList/
│   │   ├── MessagingConversationList.tsx
│   │   ├── MessagingConversationTabs/     # Onglets « Tous » / « Non lus »
│   │   └── MessagingConversationListItem/
│   └── MessagingConversation/
│       ├── MessagingConversation.tsx
│       ├── MessagingConversationHeader/
│       │   ├── ActionList/
│       │   └── MessagingShareNetwork/
│       ├── MessagingConversationReport/
│       ├── MessagingEditor/
│       │   └── Attachment/
│       ├── MessagingFeedback/
│       ├── MessagingFirstContact/         # Bandeau + modale de premier contact
│       ├── MessagingMessage/
│       │   ├── MessageMedias/
│       │   └── MessagingMessageSuspiciousModal/
│       ├── MessagingPinnedInfo/
│       ├── MessagingSuggestions/
│       └── MessagingWaitingReplyBanner/   # « En attente de réponse »
│
└── utils/
    └── SuspiciousContent.ts          # Détection de contenu suspect
```

---

### Composants

#### Composants principaux

| Composant                 | Rôle                                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Messaging.tsx`           | Point d'entrée. Détecte la plateforme et rend la version desktop ou mobile. Gère le paramètre URL `userId` pour initier une nouvelle conversation. |
| `Messaging.desktop.tsx`   | Affiche la liste des conversations à gauche et la conversation sélectionnée à droite.                                                              |
| `Messaging.mobile.tsx`    | Affiche soit la liste soit la conversation (navigation entre vues).                                                                                |
| `MessagingEmptyState.tsx` | Affiché quand l'utilisateur n'a aucune conversation. Invite à contacter un membre du réseau.                                                       |

#### Liste des conversations

| Composant                       | Rôle                                                                                                                                                           |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MessagingConversationList`     | Affiche la liste de toutes les conversations. Permet la recherche par nom de participant. Indique les conversations non lues et celles en attente de feedback. |
| `MessagingConversationTabs`     | Filtre la liste : onglet « Tous » ou « Non lus · N ».                                                                                                          |
| `MessagingConversationListItem` | Affiche un élément de la liste : avatar, nom, aperçu du dernier message, date, badges (non lu / feedback).                                                     |

#### Vue conversation

| Composant                     | Rôle                                                                                                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MessagingConversation`       | Composant central. Charge la conversation, gère le polling (30 s), l'auto-scroll, l'affichage des suggestions, du feedback, et des alertes épinglées. |
| `MessagingConversationHeader` | Informations de l'interlocuteur, liste d'actions (`ActionList`), partage de réseau (`MessagingShareNetwork`) et bouton de signalement.                |
| `MessagingMessage`            | Affiche un message individuel. Sanitize le HTML, détecte les liens suspects, propose de signaler.                                                    |
| `MessageMedias`               | Affiche les pièces jointes d'un message (images ou fichiers).                                                                                        |
| `MessagingEditor`             | Zone de saisie. Gère la mise en forme auto du textarea, l'upload de fichier, la prévisualisation des pièces jointes, et l'envoi.                     |
| `MessagingPinnedInfo`         | Bandeau d'alerte épinglé en haut de la conversation (`ADDRESSEE_UNAVAILABLE` ou `ADDRESSEE_DELETED`).                                                |
| `MessagingFirstContactBanner` / `MessagingFirstContactModal` | Accompagnent l'utilisateur lors d'un premier contact avec un membre.                                                   |
| `MessagingWaitingReplyBanner` | Affiché après l'envoi d'un premier message resté sans réponse. Propose de découvrir d'autres membres du rôle opposé.                                 |
| `MessagingFeedback`           | Note en étoiles (1-5) affichée quand `shouldGiveFeedback === true`. Différents textes selon le rôle de l'utilisateur.                                |
| `MessagingConversationReport` | Modale de signalement : raison + commentaire libre.                                                                                                  |
| `MessagingSuggestions`        | Suggestions de messages pré-écrits (voir section dédiée).                                                                                            |
| `MessagingAIPanel` / `MessagingAIAssistant` | Panneau latéral d'assistant IA, en streaming (voir section dédiée).                                                                    |
| `RecapSuggestedMessage`       | Récapitulatif du message suggéré, construit à partir du contexte de la conversation.                                                                 |

---

### État Redux

Depuis la migration vers RTK Query (voir [use-cases.md](./use-cases.md)), **les données serveur ne sont plus dans le slice** : conversations et messages vivent dans le cache RTK Query. Le slice ne conserve que l'état d'interface.

**Slice** : `src/use-cases/messaging/messaging.slice.ts`

```typescript
{
  selectedConversationId: string | null;  // 'new' pour une conversation en cours de création
  pinnedInfo: 'ADDRESSEE_UNAVAILABLE' | 'ADDRESSEE_DELETED' | null;
  query: string;                          // Filtre de recherche dans la liste
  newMessage: string;                     // Valeur courante de l'éditeur
  isAIPanelOpen: boolean;                 // Panneau assistant IA ouvert
  activePanelView: 'ai';                  // Vue active du panneau latéral
}
```

Le slice expose aussi des **actions déclencheuses no-op** — `getConversationsRequested`, `getSelectedConversationRequested`, `postMessageRequested`, `bindNewConversationRequested`, `postFeedbackRequested`, `getUnseenConversationsCountRequested` — dont le traitement réel vit dans `messaging.api.ts`, branché par `messaging.listeners.ts`. Les composants continuent donc de dispatcher des actions métier lisibles.

**Endpoints RTK Query** : `src/use-cases/messaging/messaging.api.ts`

| Endpoint | Type | Rôle |
| --- | --- | --- |
| `getConversations` | query | Liste des conversations |
| `getSelectedConversation` | query | Conversation complète avec ses messages ; resynchronise l'élément de liste correspondant |
| `getUnseenConversationsCount` | query | Compteur pour le badge de navigation |
| `postMessage` | mutation | Envoi ; met à jour le cache de façon optimiste (`fixedCacheKey: 'postMessage'`) |
| `bindNewConversation` | mutation | Résout ou crée la conversation cible |
| `postFeedback` | mutation | Note de satisfaction ; repasse `shouldGiveFeedback` à `false` |

**Sélecteurs principaux** :

| Sélecteur                                  | Retourne                                        |
| ------------------------------------------ | ----------------------------------------------- |
| `selectConversations`                      | Liste de toutes les conversations (cache)       |
| `selectSelectedConversation`               | Conversation actuellement affichée              |
| `selectSelectedConversationId`             | ID de la conversation sélectionnée              |
| `selectNewMessage`                         | Texte en cours de saisie                        |
| `selectPinnedInfo`                         | Alerte épinglée à afficher                      |
| `selectUnseenConversationCount`            | Nombre de conversations non vues (badge nav)    |
| `selectShouldGiveFeedback`                 | Booléen : afficher le composant feedback        |
| `selectConversationParticipantsAreDeleted` | Booléen : conversation en lecture seule         |
| `selectHasMessages`                        | Booléen : la conversation contient des messages |
| `selectCurrentUserHasSentMessages`         | Booléen : l'utilisateur a déjà écrit            |
| `selectOtherParticipantHasNotReplied`      | Booléen : pilote `MessagingWaitingReplyBanner`  |
| `selectGetConversationsStatus` / `selectPostMessageStatus` | Statut des requêtes             |
| `selectIsAIPanelOpen` / `selectActivePanelView` | État du panneau assistant IA               |

---

### Flux de données

#### Envoi d'un message

1. L'utilisateur saisit son message dans `MessagingEditor`
2. Le texte est synchronisé dans le store via `setNewMessage(text)`
3. L'utilisateur peut joindre un fichier (PDF ou image) via `FileInput`
4. Au clic sur « Envoyer », un `FormData` est construit avec :
   - `content` — texte du message
   - `files[]` — pièces jointes éventuelles
   - `conversationId` (conversation existante) **ou** `participantIds[]` (nouvelle conversation)
5. L'action `postMessageRequested(formData)` est dispatchée
6. Le listener déclenche la mutation `postMessage`, qui appelle `Api.postMessage(formData)`
7. En cas de succès, `onQueryStarted` met à jour le cache :
   - Si nouvelle conversation : elle est sélectionnée, son entrée de cache est créée (`upsertQueryData`) et elle est ajoutée en tête de liste
   - Si conversation existante : le message est ajouté, `seenAt` de l'auteur est mis à jour, et la conversation remonte en tête
   - L'input et les pièces jointes sont réinitialisés
8. Si le back-end répond que la **limite quotidienne de nouvelles conversations** est atteinte, une notification d'erreur est affichée

#### Réception des messages

- Au montage du composant : `getConversationsRequested()` charge toutes les conversations
- À la sélection d'une conversation : `getSelectedConversationRequested()` charge les messages complets
- **Polling toutes les 30 secondes** (`DELAY_REFRESH_CONVERSATIONS` dans `src/constants/index.ts`) : rafraîchissement de la liste et de la conversation en cours
- Le polling est nettoyé (`clearInterval`) au démontage du composant

> La messagerie utilise du **polling HTTP** (pas de WebSocket). Pusher est bien configuré dans le projet, mais uniquement pour la génération de profil et le statut des embeddings (voir `src/constants/pusher.ts`).

#### Initiation d'une nouvelle conversation

1. Depuis une fiche utilisateur ou via le paramètre URL `?userId=xxx`
2. L'action `bindNewConversationRequested(userId)` est dispatchée
3. La mutation `bindNewConversation` :
   - Recharge les conversations existantes (`forceRefetch`)
   - Cherche une conversation `direct` existante avec ce participant
   - Si oui : la sélectionne
   - Si non : récupère le profil public via `Api.getPublicUserProfile(userId)`, sélectionne l'identifiant sentinelle `'new'` et amorce l'entrée de cache correspondante avec une conversation factice
4. Les suggestions de messages sont affichées tant que `selectedConversationId === 'new'`
5. Le premier message envoyé déclenche la création réelle de la conversation côté back-end

---

### Suggestions de messages (`MessagingSuggestions`)

Le composant a deux variantes :

| Variante | Quand |
| --- | --- |
| `default` | À l'initiation d'une **nouvelle conversation**, tant qu'aucun texte n'est saisi |
| `quick-replies` | Réponses rapides dans une conversation existante |

Les suggestions sont adaptées au rôle de l'utilisateur connecté et interpolent le prénom des participants (et, pour les candidats, leur métier et secteur issus du profil).

**Variante `default`**

| Rôle | Nombre | Thèmes |
| --- | --- | --- |
| Candidat | 6 | Affiner son projet, créer un premier CV, relecture de CV, préparation d'entretien, solliciter le réseau, retour d'expérience |
| Coach / Prescripteur | 4 | Proposer un échange, clarifier son projet, activer mon réseau, partager mon expérience |
| Admin | 0 | Pas de suggestions |

**Variante `quick-replies`**

| Rôle | Nombre | Thèmes |
| --- | --- | --- |
| Candidat | 4 | Oui avec plaisir, proposer un créneau, dire ce que je cherche, ne suis plus disponible |
| Coach | 3 | Proposer de l'aide, pas disponible, domaine d'activité différent |

Quand l'utilisateur clique sur une suggestion, le texte pré-écrit remplit l'éditeur. Il peut le modifier avant d'envoyer.

---

### Assistant IA (`MessagingAIPanel`)

Panneau latéral ouvert depuis la conversation (`isAIPanelOpen` dans le slice), qui aide l'utilisateur à rédiger et à avancer dans son échange.

| Appel | Endpoint |
| --- | --- |
| `Api.getAISession(conversationId)` | `GET /ai-assistant/conversations/:id/session` |
| `Api.streamAIMessage(conversationId, message)` | Réponse **en streaming** (`fetch` + token depuis `localStorage`, hors instance Axios) |
| `Api.resetAISession(conversationId)` | `DELETE /ai-assistant/conversations/:id/session/messages` |

Les messages de l'assistant sont rendus par `AssistantMessageBubble`.

---

### API

**Base path** : `/messaging`

| Méthode | Endpoint                                | Action                                           |
| ------- | --------------------------------------- | ------------------------------------------------ |
| GET     | `/messaging/conversations`              | Lister toutes les conversations de l'utilisateur |
| GET     | `/messaging/conversations/:id`          | Récupérer une conversation avec ses messages     |
| POST    | `/messaging/messages`                   | Envoyer un message (FormData)                    |
| GET     | `/messaging/conversations/:id/medias`   | Lister les médias d'une conversation             |
| GET     | `/messaging/conversations/unseen-count` | Nombre de conversations non vues                 |
| POST    | `/messaging/conversations/:id/report`   | Signaler une conversation                        |
| POST    | `/messaging/conversations/feedback`     | Soumettre une note de satisfaction               |
| POST    | `/messaging/mailing-lists`              | Créer une liste de diffusion (admin)             |

---

### Sécurité

#### Détection de contenu suspect

Le fichier `src/utils/SuspiciousContent.ts` expose `isSuspiciousMessage(message)`.

- Les expressions interdites sont configurées via la variable d'environnement `NEXT_PUBLIC_MESSAGING_FORBIDDEN_EXPRESSIONS` (liste séparée par des virgules)
- La détection est insensible à la casse et utilise des word boundaries (`\b`)
- Si un message est détecté comme suspect, une icône d'avertissement est affichée

#### Validation des liens externes

- Les URLs dans les messages sont détectées via `linkify()`
- Les domaines de confiance sont définis dans `NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS`
- Pour tout lien vers un domaine non listé, une modale de confirmation est affichée avant ouverture
- Les messages des admins sont exemptés de cette vérification

#### Signalement

L'utilisateur peut signaler une conversation via le bouton dans le header. La modale demande une raison et un commentaire libre, puis appelle `POST /messaging/conversations/:id/report`.

#### Limite quotidienne

Le back-end limite le nombre de nouvelles conversations initiées par jour. L'erreur correspondante est détectée par `isMessagingDailyConversationLimitReachedError` (`src/api/axiosErrors.ts`) et convertie en notification utilisateur.

---

### Statut de lecture et badge non lu

- Le statut de lecture est suivi via le champ `conversationParticipant.seenAt`
- La fonction utilitaire `conversationHasUnreadMessages()` compare la date du dernier message de l'interlocuteur avec `seenAt`
- Les conversations non lues sont visuellement mises en avant dans la liste et filtrables via l'onglet « Non lus »
- Le compteur de conversations non vues est affiché dans la navigation principale

---

### Feedback de qualité

Quand le back-end passe `shouldGiveFeedback: true` sur une conversation :

- Le composant `MessagingFeedback` s'affiche au-dessus de l'éditeur
- L'utilisateur note la conversation de 1 à 5 étoiles
- Fermer sans noter ou noter déclenche `postFeedbackRequested({ conversationParticipantId, rating })`
- Endpoint : `POST /messaging/conversations/feedback`
- En cas de succès, `shouldGiveFeedback` repasse à `false` directement dans le cache
