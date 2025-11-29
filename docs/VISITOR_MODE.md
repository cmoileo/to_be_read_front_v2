## 👤 Mode Visiteur (Non authentifié)

Un utilisateur non authentifié peut accéder aux fonctionnalités suivantes en **lecture seule** :

### ✅ Routes accessibles sans authentification

| Route                                   | Description                                |
| --------------------------------------- | ------------------------------------------ |
| `GET /search`                           | Recherche globale (users, livres, reviews) |
| `GET /search/users`                     | Recherche d'utilisateurs paginée           |
| `GET /search/books`                     | Recherche de livres paginée                |
| `GET /search/reviews`                   | Recherche de reviews paginée               |
| `GET /users`                            | Recherche d'utilisateurs                   |
| `GET /user/:id`                         | Voir le profil d'un utilisateur            |
| `GET /review/:id`                       | Voir une review                            |
| `GET /popular-reviews/:page`            | Voir les reviews populaires                |
| `GET /book/:googleBookId`               | Voir les détails d'un livre                |
| `GET /book/:googleBookId/reviews/:page` | Voir les reviews d'un livre                |
| `GET /comments/:id/:page`               | Voir les commentaires d'une review         |

### 🔒 Routes nécessitant une authentification

| Action                        | Route                           |
| ----------------------------- | ------------------------------- |
| Publier une review            | `POST /reviews`                 |
| Supprimer sa review           | `DELETE /review/:id`            |
| Liker une review              | `GET /review/:id/like`          |
| Poster un commentaire         | `POST /comment`                 |
| Supprimer son commentaire     | `DELETE /comment/:id`           |
| Liker un commentaire          | `GET /comment/:id/like`         |
| Follow un utilisateur         | `GET /user/:id/follow`          |
| Unfollow un utilisateur       | `GET /user/:id/unfollow`        |
| Voir ses followers/followings | `GET /followers/:userId/:page`  |
| Gérer sa to-read list         | `POST/DELETE/GET /to-read-list` |
| Voir son feed personnalisé    | `GET /feed/:page`               |

### 📝 Comportement des données en mode visiteur

Quand un visiteur (non authentifié) accède aux données :

- **`isFollowing`** : Toujours `false`
- **`isMe`** : Toujours `false`
- **`hasUserLiked`** : Toujours `false`
- **`isFromCurrentUser`** : Toujours `false`

Le front peut utiliser ces valeurs pour :

- Masquer les boutons "Follow" / "Unfollow"
- Masquer les boutons "Like"
- Afficher un message invitant à se connecter pour interagir

### 💡 Recommandations pour le front

1. **Détecter le mode visiteur** : Vérifier si un token est présent
2. **Afficher les données** : Toutes les données de lecture sont disponibles
3. **Bloquer les interactions** : Afficher un modal de connexion quand l'utilisateur tente de :
   - Liker une review/commentaire
   - Poster un commentaire
   - Suivre un utilisateur
   - Ajouter un livre à sa liste
4. **CTA de connexion** : Ajouter des boutons "Se connecter pour interagir"

---
