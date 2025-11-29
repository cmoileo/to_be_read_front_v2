## 👥 Followers / Followings

### GET `/followers/:userId/:page`

**Authentification requise** : Oui

Récupérer la liste des followers d'un utilisateur (paginée).

**Paramètres URL** :

- `userId` : ID de l'utilisateur dont on veut voir les followers
- `page` : Numéro de page

**Exemple de requête** :

```
GET /followers/123/1
```

**Réponse** :

```json
{
  "data": [
    {
      "id": 456,
      "userName": "john_doe",
      "avatarUrl": "url",
      "biography": "Passionné de lecture",
      "isMe": false
    },
    {
      "id": 789,
      "userName": "jane_doe",
      "avatarUrl": "url",
      "biography": "Fan de fantasy",
      "isMe": true
    }
  ],
  "meta": {
    "currentPage": 1,
    "lastPage": 3,
    "total": 50,
    "perPage": 20
  }
}
```

---

### GET `/followings/:userId/:page`

**Authentification requise** : Oui

Récupérer la liste des utilisateurs suivis par un utilisateur (paginée).

**Paramètres URL** :

- `userId` : ID de l'utilisateur dont on veut voir les followings
- `page` : Numéro de page

**Exemple de requête** :

```
GET /followings/123/1
```

**Réponse** :

```json
{
  "data": [
    {
      "id": 456,
      "userName": "author_fav",
      "avatarUrl": "url",
      "biography": "Auteur de romans",
      "isMe": false
    }
  ],
  "meta": {
    "currentPage": 1,
    "lastPage": 2,
    "total": 25,
    "perPage": 20
  }
}
```

---

### GET `/user/:id/follow`

**Authentification requise** : Oui

Suivre un utilisateur.

**Paramètres URL** :

- `id` : ID de l'utilisateur à suivre

**Exemple de requête** :

```
GET /user/456/follow
```

**Réponse** :

```json
{
  "status": "success",
  "code": "USER_FOLLOWED",
  "message": "User followed successfully"
}
```

**Erreurs possibles** :

- `400` : Vous ne pouvez pas vous suivre vous-même
- `400` : Vous suivez déjà cet utilisateur

---

### GET `/user/:id/unfollow`

**Authentification requise** : Oui

Ne plus suivre un utilisateur.

**Paramètres URL** :

- `id` : ID de l'utilisateur à unfollow

**Exemple de requête** :

```
GET /user/456/unfollow
```

**Réponse** :

```json
{
  "status": "success",
  "code": "USER_UNFOLLOWED",
  "message": "User unfollowed successfully"
}
```

**Erreurs possibles** :

- `400` : Vous ne pouvez pas vous unfollow vous-même
- `400` : Vous ne suivez pas cet utilisateur
