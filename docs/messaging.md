## Messaging

La messagerie permet aux utilisateurs de la plateforme (candidats, coachs, bénévoles) d'échanger des messages privés, avec pièces jointes, suggestions de messages, et système de feedback.

> Pour la partie back-end, voir `entourage-job-back/docs/messaging.md`.

---

### Structure des fichiers

```
src/
├── use-cases/messaging/              # State management (Redux + Saga)
│   ├── messaging.slice.ts
│   ├── messaging.saga.ts
│   ├── messaging.adapter.ts
│   ├── messaging.selectors.ts
│   └── index.ts
│
├── api/
│   ├── api.ts                        # Endpoints API messaging
│   └── types.ts                      # Types Message, Conversation, Media...
│
├── features/backoffice/messaging/    # Composants UI
│   ├── Messaging.tsx                 # Point d'entrée (responsive)
│   ├── Messaging.desktop.tsx
│   ├── Messaging.mobile.tsx
│   ├── MessagingEmptyState.tsx
│   ├── messaging.utils.ts
│   ├── MessagingConversationsList/
│   │   ├── MessagingConversationList.tsx
│   │   └── MessagingConversationListItem/
│   └── MessagingConversation/
│       ├── MessagingConversation.tsx
│       ├── MessagingConversationHeader/
│       ├── MessagingConversationReport/
│       ├── MessagingEditor/
│       │   └── Attachment/
│       ├── MessagingFeedback/
│       ├── MessagingMessage/
│       │   ├── MessageMedias/
│       │   └── MessagingMessageSuspiciousModal/
│       ├── MessagingPinnedInfo/
│       └── MessagingSuggestions/
│
└── utils/
    └── SuspiciousContent.ts          # Détection de contenu suspect
```

---

### Composants

#### Composants principaux

| Composant | Rôle |
|-----------|------|
| `Messaging.tsx` | Point d'entrée. Détecte la plateforme et rend la version desktop ou mobile. Gère le paramètre URL `userId` pour initier une nouvelle conversation. |
| `Messaging.desktop.tsx` | Affiche la liste des conversations à gauche et la conversation sélectionnée à droite. |
| `Messaging.mobile.tsx` | Affiche soit la liste soit la conversation (navigation entre vues). |
| `MessagingEmptyState.tsx` | Affiché quand l'utilisateur n'a aucune conversation. Invite à contacter un membre du réseau. |

#### Liste des conversations

| Composant | Rôle |
|-----------|------|
| `MessagingConversationList` | Affiche la liste de toutes les conversations. Permet la recherche par nom de participant. Indique les conversations non lues et celles en attente de feedback. |
| `MessagingConversationListItem` | Affiche un élément de la liste : avatar, nom, aperçu du dernier message, date, badges (non lu / feedback). |

#### Vue conversation

| Composant | Rôle |
|-----------|------|
| `MessagingConversation` | Composant central. Charge la conversation, gère le polling (30s), l'auto-scroll, l'affichage des suggestions, du feedback, et des alertes épinglées. |
| `MessagingConversationHeader` | Affiche les informations de l'interlocuteur et le bouton de signalement. |
| `MessagingMessage` | Affiche un message individuel. Sanitize le HTML, détecte les liens suspects, propose de signaler. |
| `MessageMedias` | Affiche les pièces jointes d'un message (images ou fichiers). |
| `MessagingEditor` | Zone de saisie de message. Gère la mise en forme auto du textarea, l'upload de fichier, la prévisualisation des pièces jointes, et l'envoi. |
| `MessagingPinnedInfo` | Bandeau d'alerte épinglé en haut de la conversation (`ADDRESSEE_UNAVAILABLE` ou `ADDRESSEE_DELETED`). |
| `MessagingFeedback` | Note en étoiles (1-5) affichée quand `shouldGiveFeedback === true`. Différents textes selon le rôle de l'utilisateur. |
| `MessagingConversationReport` | Modale de signalement : raison + commentaire libre. |
| `MessagingSuggestions` | Suggestions de messages pré-écrits pour initier une nouvelle conversation (voir section dédiée). |

---

### Flux de données

#### Envoi d'un message

1. L'utilisateur saisit son message dans `MessagingEditor`
2. Le texte est synchronisé dans le store via `setNewMessage(text)`
3. L'utilisateur peut joindre un fichier (PDF ou image) via `FileInput`
4. Au clic sur "Envoyer", un `FormData` est construit avec :
   - `content` — texte du message
   - `files[]` — pièces jointes éventuelles
   - `conversationId` (conversation existante) **ou** `participantIds[]` (nouvelle conversation)
5. L'action `postMessageRequested(formData)` est dispatchée
6. La saga appelle `Api.postMessage(formData)`
7. En cas de succès :
   - Si nouvelle conversation : elle est ajoutée en tête de liste
   - Si conversation existante : le message est ajouté, la conversation remonte en tête
   - L'input et les pièces jointes sont réinitialisés

#### Réception des messages

- Au montage du composant : `getConversationsRequested()` charge toutes les conversations
- À la sélection d'une conversation : `getSelectedConversationRequested()` charge les messages complets
- **Polling toutes les 30 secondes** : rafraîchissement de la liste et de la conversation en cours
- Le polling est nettoyé (`clearInterval`) au démontage du composant

> La messagerie utilise du **polling HTTP** (pas de WebSocket). Pusher est configuré dans le projet mais uniquement pour d'autres fonctionnalités.

#### Initiation d'une nouvelle conversation

1. Depuis une fiche utilisateur ou via le paramètre URL `?userId=xxx`
2. L'action `bindNewConversationRequested(userId)` est dispatchée
3. La saga :
   - Charge les conversations existantes
   - Récupère le profil public de l'interlocuteur via `Api.getPublicUserProfile(userId)`
   - Vérifie si une conversation 1-1 existe déjà
   - Si oui : sélectionne la conversation existante
   - Si non : crée un objet conversation temporaire avec `selectedConversationId = 'new'`
4. Les suggestions de messages sont affichées tant que `selectedConversationId === 'new'`
5. Le premier message envoyé déclenche la création réelle de la conversation côté back-end

---

### Suggestions de messages (`MessagingSuggestions`)

Affichées uniquement lors de l'initiation d'une **nouvelle conversation** (tant qu'aucun texte n'est saisi).

Les suggestions sont adaptées au rôle de l'utilisateur connecté :

| Rôle | Nombre | Thèmes |
|------|--------|--------|
| Candidat | 6 | Aide au projet, création de CV, relecture de CV, préparation entretien, activation réseau, partage d'expérience |
| Coach / Bénévole | 4 | Proposer un échange, clarifier le projet, activer le réseau, partager une expérience |
| Admin | 0 | Pas de suggestions |

Quand l'utilisateur clique sur une suggestion, le texte pré-écrit remplit l'éditeur. Il peut le modifier avant d'envoyer.

---

### État Redux

**Slice** : `src/use-cases/messaging/messaging.slice.ts`

```typescript
{
  // États des requêtes
  getConversations: RequestState
  getUnseenConversationsCount: RequestState
  bindNewConversation: RequestState
  getSelectedConversation: RequestState
  postMessage: RequestState
  postFeedback: RequestState

  // Données
  conversations: Conversation[] | null
  selectedConversationId: string | null  // 'new' pour une conversation en cours de création
  selectedConversation: Conversation | null
  pinnedInfo: 'ADDRESSEE_UNAVAILABLE' | 'ADDRESSEE_DELETED' | null
  query: string                           // Filtre de recherche dans la liste
  unseenConversationCount: number
  newMessage: string                      // Valeur courante de l'éditeur
}
```

**Sélecteurs principaux** :

| Sélecteur | Retourne |
|-----------|----------|
| `selectConversations` | Liste de toutes les conversations |
| `selectSelectedConversation` | Conversation actuellement affichée |
| `selectSelectedConversationId` | ID de la conversation sélectionnée |
| `selectNewMessage` | Texte en cours de saisie |
| `selectPinnedInfo` | Alerte épinglée à afficher |
| `selectUnseenConversationCount` | Nombre de conversations non vues (badge nav) |
| `selectShouldGiveFeedback` | Booléen : afficher le composant feedback |
| `selectConversationParticipantsAreDeleted` | Booléen : conversation en lecture seule |
| `selectHasMessages` | Booléen : la conversation contient des messages |

---

### API

**Base path** : `/messaging`

| Méthode | Endpoint | Action |
|---------|----------|--------|
| GET | `/messaging/conversations` | Lister toutes les conversations de l'utilisateur |
| GET | `/messaging/conversations/:id` | Récupérer une conversation avec ses messages |
| POST | `/messaging/messages` | Envoyer un message (FormData) |
| GET | `/messaging/conversations/:id/medias` | Lister les médias d'une conversation |
| GET | `/messaging/conversations/unseen-count` | Nombre de conversations non vues |
| POST | `/messaging/conversations/:id/report` | Signaler une conversation |
| POST | `/messaging/conversations/feedback` | Soumettre une note de satisfaction |

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

---

### Statut de lecture et badge non lu

- Le statut de lecture est suivi via le champ `conversationParticipant.seenAt`
- La fonction utilitaire `conversationHasUnreadMessages()` compare la date du dernier message de l'interlocuteur avec `seenAt`
- Les conversations non lues sont visuellement mises en avant dans la liste
- Le compteur de conversations non vues est affiché dans la navigation principale

---

### Feedback de qualité

Quand le back-end passe `shouldGiveFeedback: true` sur une conversation :
- Le composant `MessagingFeedback` s'affiche au-dessus de l'éditeur
- L'utilisateur note la conversation de 1 à 5 étoiles
- Fermer sans noter ou noter déclenche `postFeedbackRequested({ conversationParticipantId, rating })`
- Endpoint : `POST /messaging/conversations/feedback`
